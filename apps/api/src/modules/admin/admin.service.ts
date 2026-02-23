import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { createHash } from 'crypto';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import type { CookieOptions, Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { join, relative } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ADMIN_AUTH_COOKIE,
  DEFAULT_ADMIN_SESSION_TTL_HOURS,
  DEFAULT_LOGIN_LOCK_WINDOW_MINUTES,
  DEFAULT_LOGIN_MAX_ATTEMPTS,
} from './admin.constants';

type LoginContext = {
  ipAddress: string | null;
  userAgent: string | null;
};

type AuthSessionPayload = {
  sub: string;
  sid: string;
  email: string;
  iat?: number;
  exp?: number;
};

type LoginAttemptState = {
  count: number;
  firstAttemptAtMs: number;
  blockedUntilMs: number | null;
};

@Injectable()
export class AdminService {
  private readonly loginAttempts = new Map<string, LoginAttemptState>();
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {}

  async login(
    emailRaw: string,
    passwordRaw: string,
    context: LoginContext,
  ): Promise<{
    token: string;
    expiresAt: Date;
    admin: { id: string; email: string };
  }> {
    const email = emailRaw?.trim().toLowerCase();
    const password = passwordRaw?.trim();
    const attemptKey = this.getAttemptKey(email, context.ipAddress);

    this.assertLoginNotRateLimited(attemptKey);
    this.assertCredentialsShape(email, password);

    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    const hasValidPassword = admin
      ? await compare(password, admin.password)
      : false;

    if (!admin || !hasValidPassword) {
      this.markFailedLogin(attemptKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.clearFailedLogins(attemptKey);

    const sessionTtlMs = this.getSessionTtlMs();
    const expiresAt = new Date(Date.now() + sessionTtlMs);

    await this.prisma.adminSession.deleteMany({
      where: {
        adminId: admin.id,
        OR: [{ revokedAt: { not: null } }, { expiresAt: { lt: new Date() } }],
      },
    });

    const session = await this.prisma.adminSession.create({
      data: {
        adminId: admin.id,
        expiresAt,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
      },
    });

    const token = sign(
      {
        sub: admin.id,
        sid: session.id,
        email: admin.email,
      } satisfies AuthSessionPayload,
      this.getJwtSecret(),
      {
        expiresIn: Math.floor(sessionTtlMs / 1000),
      },
    );

    return {
      token,
      expiresAt,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async validateSessionToken(token: string) {
    const payload = this.parseSessionPayload(token);

    const session = await this.prisma.adminSession.findFirst({
      where: {
        id: payload.sid,
        adminId: payload.sub,
        revokedAt: null,
      },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid admin session');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.prisma.adminSession.updateMany({
        where: { id: session.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Admin session expired');
    }

    return session;
  }

  async logout(token: string): Promise<void> {
    let payload: AuthSessionPayload | null = null;

    try {
      payload = this.parseSessionPayload(token, { ignoreExpiration: true });
    } catch {
      return;
    }

    await this.prisma.adminSession.updateMany({
      where: {
        id: payload.sid,
        adminId: payload.sub,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  extractToken(request: Request): string | null {
    const cookieToken = this.getCookieToken(request);
    if (cookieToken) {
      return cookieToken;
    }

    const authHeader = request.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length).trim();
    }

    return null;
  }

  getAuthCookieOptions(expiresAt: Date): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      path: '/',
      expires: expiresAt,
    };
  }

  getAuthCookieName(): string {
    return ADMIN_AUTH_COOKIE;
  }

  async registerMedia(file: Express.Multer.File) {
    if (!file?.path) {
      throw new BadRequestException('File upload failed');
    }

    const storageKey = this.toStorageKey(file.path);
    const cdnUrl = this.buildCdnUrl(storageKey);

    return this.prisma.media.create({
      data: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey,
        cdnUrl,
      },
    });
  }

  async listMedia(limitRaw?: string) {
    const parsedLimit = Number.parseInt(limitRaw ?? '30', 10);
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 100)
      : 30;

    return this.prisma.media.findMany({
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async removeMedia(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const absolutePath = join(this.uploadRoot, media.storageKey);
    if (existsSync(absolutePath)) {
      await unlink(absolutePath);
    }

    await this.prisma.media.delete({
      where: { id },
    });

    return { success: true };
  }

  private getCookieToken(request: Request): string | null {
    const rawCookies = request.cookies as Record<string, unknown> | undefined;
    const token = rawCookies?.[ADMIN_AUTH_COOKIE];
    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  private toStorageKey(filePath: string): string {
    return relative(this.uploadRoot, filePath).replace(/\\/g, '/');
  }

  private buildCdnUrl(storageKey: string): string {
    const defaultCdnBase = `http://localhost:${process.env.BACKEND_PORT ?? 5555}/cdn`;
    const cdnBase = (process.env.CDN_BASE_URL ?? defaultCdnBase).replace(
      /\/$/,
      '',
    );
    return `${cdnBase}/${storageKey}`;
  }

  private parseSessionPayload(
    token: string,
    options?: { ignoreExpiration?: boolean },
  ): AuthSessionPayload {
    try {
      const decoded = verify(token, this.getJwtSecret(), {
        ignoreExpiration: options?.ignoreExpiration ?? false,
      });

      if (!decoded || typeof decoded !== 'object') {
        throw new UnauthorizedException('Invalid admin session token');
      }

      const payload = decoded as Partial<AuthSessionPayload>;
      if (!payload.sub || !payload.sid || !payload.email) {
        throw new UnauthorizedException('Malformed admin session token');
      }

      return {
        sub: payload.sub,
        sid: payload.sid,
        email: payload.email,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired admin session token');
    }
  }

  private getAttemptKey(email: string, ipAddress: string | null): string {
    const normalizedEmail = email?.toLowerCase().trim() || 'unknown';
    const normalizedIp = ipAddress?.trim() || 'unknown-ip';
    return createHash('sha256')
      .update(`${normalizedEmail}:${normalizedIp}`)
      .digest('hex');
  }

  private assertCredentialsShape(email: string, password: string): void {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    if (!email.includes('@') || email.length > 180) {
      throw new BadRequestException('Invalid email');
    }

    if (password.length < 8 || password.length > 128) {
      throw new BadRequestException('Invalid password');
    }
  }

  private assertLoginNotRateLimited(attemptKey: string): void {
    const state = this.loginAttempts.get(attemptKey);
    if (!state || !state.blockedUntilMs) {
      return;
    }

    const now = Date.now();
    if (state.blockedUntilMs > now) {
      throw new HttpException(
        'Too many failed login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.loginAttempts.delete(attemptKey);
  }

  private markFailedLogin(attemptKey: string): void {
    const now = Date.now();
    const existingState = this.loginAttempts.get(attemptKey);
    const lockWindowMs =
      this.getLoginLockWindowMinutes() * 60 * 1000;

    if (!existingState || now - existingState.firstAttemptAtMs > lockWindowMs) {
      this.loginAttempts.set(attemptKey, {
        count: 1,
        firstAttemptAtMs: now,
        blockedUntilMs: null,
      });
      return;
    }

    const nextCount = existingState.count + 1;
    const shouldBlock = nextCount >= this.getMaxLoginAttempts();

    this.loginAttempts.set(attemptKey, {
      count: nextCount,
      firstAttemptAtMs: existingState.firstAttemptAtMs,
      blockedUntilMs: shouldBlock ? now + lockWindowMs : null,
    });
  }

  private clearFailedLogins(attemptKey: string): void {
    this.loginAttempts.delete(attemptKey);
  }

  private getSessionTtlMs(): number {
    const hours = Number.parseInt(
      process.env.ADMIN_SESSION_TTL_HOURS ??
        String(DEFAULT_ADMIN_SESSION_TTL_HOURS),
      10,
    );
    const normalizedHours =
      Number.isFinite(hours) && hours >= 1 && hours <= 72
        ? hours
        : DEFAULT_ADMIN_SESSION_TTL_HOURS;
    return normalizedHours * 60 * 60 * 1000;
  }

  private getMaxLoginAttempts(): number {
    const attempts = Number.parseInt(
      process.env.ADMIN_LOGIN_MAX_ATTEMPTS ??
        String(DEFAULT_LOGIN_MAX_ATTEMPTS),
      10,
    );
    if (!Number.isFinite(attempts) || attempts < 3 || attempts > 15) {
      return DEFAULT_LOGIN_MAX_ATTEMPTS;
    }
    return attempts;
  }

  private getLoginLockWindowMinutes(): number {
    const minutes = Number.parseInt(
      process.env.ADMIN_LOGIN_LOCK_WINDOW_MINUTES ??
        String(DEFAULT_LOGIN_LOCK_WINDOW_MINUTES),
      10,
    );
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 120) {
      return DEFAULT_LOGIN_LOCK_WINDOW_MINUTES;
    }
    return minutes;
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 24) {
      throw new InternalServerErrorException(
        'JWT_SECRET must be set to a strong value (at least 24 chars)',
      );
    }
    return secret;
  }
}
