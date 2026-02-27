import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { createHash } from 'crypto';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import type { CookieOptions, Request } from 'express';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { join, relative } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ADMIN_AUTH_COOKIE,
  DEFAULT_ADMIN_ENFORCE_IP_BINDING,
  DEFAULT_ADMIN_MAX_ACTIVE_SESSIONS,
  DEFAULT_ADMIN_REQUIRE_ORIGIN_FOR_MUTATIONS,
  DEFAULT_ADMIN_SESSION_TTL_HOURS,
  DEFAULT_LOGIN_LOCK_WINDOW_MINUTES,
  DEFAULT_LOGIN_MAX_ATTEMPTS,
  DEFAULT_MEDIA_CLEANUP_BATCH_LIMIT,
  DEFAULT_MEDIA_CLEANUP_GRACE_HOURS,
} from './admin.constants';

type LoginContext = {
  ipAddress: string | null;
  userAgent: string | null;
};

export type RequestContext = LoginContext & {
  origin: string | null;
  method: string;
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

type MediaUsageSummary = {
  services: number;
  doctors: number;
  blogPosts: number;
  galleryItems: number;
  total: number;
};

type MediaCleanupItem = {
  id: string;
  storageKey: string;
  cdnUrl: string;
  status:
    | 'would_delete'
    | 'deleted'
    | 'skipped_in_use'
    | 'deleted_file_missing'
    | 'deleted_file_error';
  reason?: string;
};

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly loginAttempts = new Map<string, LoginAttemptState>();
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {}

  getRequestContext(request: Request): RequestContext {
    const forwardedUserAgentHeader = request.headers['x-ultramed-client-user-agent'];
    const userAgentHeader =
      typeof forwardedUserAgentHeader === 'string' && forwardedUserAgentHeader.trim().length > 0
        ? forwardedUserAgentHeader
        : request.headers['user-agent'];
    return {
      ipAddress: this.extractIpAddress(request),
      userAgent:
        typeof userAgentHeader === 'string' && userAgentHeader.trim().length > 0
          ? userAgentHeader.trim()
          : null,
      origin: this.extractOrigin(request),
      method: request.method ?? 'GET',
    };
  }

  assertValidMutationOrigin(context: RequestContext): void {
    if (!this.isMutationMethod(context.method)) {
      return;
    }

    if (!this.getRequireOriginForMutations()) {
      return;
    }

    const allowedOrigins = this.getAllowedOrigins();
    if (allowedOrigins.size === 0) {
      return;
    }

    if (!context.origin) {
      this.throwHttpError(
        HttpStatus.FORBIDDEN,
        'AUTH_ORIGIN_REQUIRED',
        'Origin header is required for this operation',
      );
    }

    if (!allowedOrigins.has(context.origin)) {
      this.throwHttpError(
        HttpStatus.FORBIDDEN,
        'AUTH_ORIGIN_NOT_ALLOWED',
        'Request origin is not allowed',
        { origin: context.origin },
      );
    }
  }

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

    this.pruneLoginAttempts();
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
      this.throwHttpError(
        HttpStatus.UNAUTHORIZED,
        'AUTH_INVALID_CREDENTIALS',
        'Invalid credentials',
      );
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

    await this.enforceMaxActiveSessions(admin.id, session.id);

    const token = sign(
      {
        sub: admin.id,
        sid: session.id,
        email: admin.email,
      } satisfies AuthSessionPayload,
      this.getJwtSecret(),
      {
        expiresIn: Math.floor(sessionTtlMs / 1000),
        issuer: this.getJwtIssuer(),
        audience: this.getJwtAudience(),
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

  async validateSessionToken(token: string, context?: LoginContext) {
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
      this.throwHttpError(
        HttpStatus.UNAUTHORIZED,
        'AUTH_SESSION_INVALID',
        'Invalid admin session',
      );
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.revokeSessionById(session.id);
      this.throwHttpError(
        HttpStatus.UNAUTHORIZED,
        'AUTH_SESSION_EXPIRED',
        'Admin session expired',
      );
    }

    const incomingUserAgent = this.normalizeNullableText(context?.userAgent);
    const sessionUserAgent = this.normalizeNullableText(session.userAgent);
    if (incomingUserAgent && sessionUserAgent && incomingUserAgent !== sessionUserAgent) {
      await this.revokeSessionById(session.id);
      this.throwHttpError(
        HttpStatus.UNAUTHORIZED,
        'AUTH_SESSION_FINGERPRINT_MISMATCH',
        'Session fingerprint mismatch',
      );
    }

    if (this.getEnforceIpBinding()) {
      const incomingIp = this.normalizeNullableText(context?.ipAddress);
      const sessionIp = this.normalizeNullableText(session.ipAddress);
      if (incomingIp && sessionIp && incomingIp !== sessionIp) {
        await this.revokeSessionById(session.id);
        this.throwHttpError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_SESSION_IP_MISMATCH',
          'Session IP mismatch',
        );
      }
    }

    return session;
  }

  async listAdminSessions(adminId: string, currentSessionId: string) {
    const sessions = await this.prisma.adminSession.findMany({
      where: {
        adminId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return sessions.map((session: {
      id: string;
      createdAt: Date;
      expiresAt: Date;
      ipAddress: string | null;
      userAgent: string | null;
    }) => ({
      id: session.id,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      isCurrent: session.id === currentSessionId,
    }));
  }

  async revokeAdminSession(adminId: string, sessionId: string) {
    const targetSession = await this.prisma.adminSession.findFirst({
      where: {
        id: sessionId,
        adminId,
        revokedAt: null,
      },
    });

    if (!targetSession) {
      this.throwHttpError(
        HttpStatus.NOT_FOUND,
        'AUTH_SESSION_NOT_FOUND',
        'Session not found',
      );
    }

    await this.revokeSessionById(sessionId);
    return { success: true };
  }

  async logoutAll(adminId: string, exceptSessionId?: string): Promise<void> {
    await this.prisma.adminSession.updateMany({
      where: {
        adminId,
        revokedAt: null,
        id: exceptSessionId ? { not: exceptSessionId } : undefined,
      },
      data: { revokedAt: new Date() },
    });
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
    const domain = this.getAuthCookieDomain();
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      path: '/',
      expires: expiresAt,
      ...(domain ? { domain } : {}),
    };
  }

  getAuthCookieName(): string {
    return ADMIN_AUTH_COOKIE;
  }

  async registerMedia(file: Express.Multer.File) {
    if (!file?.path) {
      this.throwHttpError(
        HttpStatus.BAD_REQUEST,
        'MEDIA_UPLOAD_FAILED',
        'File upload failed',
      );
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

  async listMedia(params?: {
    limitRaw?: string;
    orphanOnlyRaw?: string;
    olderThanHoursRaw?: string;
  }) {
    const limit = this.parsePositiveIntWithinRange(params?.limitRaw, 30, 1, 100);
    const orphanOnly = this.parseBooleanFlag(params?.orphanOnlyRaw);
    const olderThanHours = this.parsePositiveIntWithinRange(
      params?.olderThanHoursRaw,
      this.getMediaCleanupGraceHours(),
      1,
      24 * 30,
    );
    const threshold = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

    const items = await this.prisma.media.findMany({
      where: orphanOnly ? this.buildOrphanWhere(threshold) : undefined,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        _count: {
          select: {
            services: true,
            doctors: true,
            blogPosts: true,
            galleryItems: true,
          },
        },
      },
    });

    return items.map((item: {
      id: string;
      originalName: string;
      mimeType: string;
      size: number;
      provider: string;
      storageKey: string;
      cdnUrl: string;
      createdAt: Date;
      updatedAt: Date;
      _count: {
        services: number;
        doctors: number;
        blogPosts: number;
        galleryItems: number;
      };
    }) => {
      const usage = this.toMediaUsageSummary(item._count);
      return {
        id: item.id,
        originalName: item.originalName,
        mimeType: item.mimeType,
        size: item.size,
        provider: item.provider,
        storageKey: item.storageKey,
        cdnUrl: item.cdnUrl,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        usage,
        isOrphan: usage.total === 0,
      };
    });
  }

  async removeMedia(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            services: true,
            doctors: true,
            blogPosts: true,
            galleryItems: true,
          },
        },
      },
    });

    if (!media) {
      this.throwHttpError(HttpStatus.NOT_FOUND, 'MEDIA_NOT_FOUND', 'Media not found');
    }

    const usage = this.toMediaUsageSummary(media._count);
    if (usage.total > 0) {
      this.throwHttpError(
        HttpStatus.CONFLICT,
        'MEDIA_IN_USE',
        'Media is used by other records and cannot be deleted',
        { mediaId: media.id, usage },
      );
    }

    const deleteResult = await this.prisma.media.deleteMany({
      where: {
        id,
        ...this.buildOrphanWhere(),
      },
    });

    if (deleteResult.count === 0) {
      this.throwHttpError(
        HttpStatus.CONFLICT,
        'MEDIA_IN_USE',
        'Media is used by other records and cannot be deleted',
        { mediaId: id },
      );
    }

    await this.tryDeleteStoredFile(media.storageKey);

    return { success: true };
  }

  async cleanupOrphanMedia(params?: {
    limitRaw?: string;
    olderThanHoursRaw?: string;
    dryRunRaw?: string;
  }) {
    const dryRun =
      params?.dryRunRaw === undefined
        ? true
        : this.parseBooleanFlag(params?.dryRunRaw);
    const limit = this.parsePositiveIntWithinRange(
      params?.limitRaw,
      this.getMediaCleanupBatchLimit(),
      1,
      500,
    );
    const olderThanHours = this.parsePositiveIntWithinRange(
      params?.olderThanHoursRaw,
      this.getMediaCleanupGraceHours(),
      1,
      24 * 30,
    );
    const threshold = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

    const candidates = await this.prisma.media.findMany({
      where: this.buildOrphanWhere(threshold),
      orderBy: [{ createdAt: 'asc' }],
      take: limit,
    });

    if (dryRun) {
      return {
        dryRun: true,
        olderThanHours,
        threshold: threshold.toISOString(),
        scannedCount: candidates.length,
        deletedCount: 0,
        skippedInUseCount: 0,
        fileDeletedCount: 0,
        fileMissingCount: 0,
        fileDeleteErrorCount: 0,
        items: candidates.map(
          (candidate: {
            id: string;
            storageKey: string;
            cdnUrl: string;
          }): MediaCleanupItem => ({
            id: candidate.id,
            storageKey: candidate.storageKey,
            cdnUrl: candidate.cdnUrl,
            status: 'would_delete',
          }),
        ),
      };
    }

    let deletedCount = 0;
    let skippedInUseCount = 0;
    let fileDeletedCount = 0;
    let fileMissingCount = 0;
    let fileDeleteErrorCount = 0;

    const items: MediaCleanupItem[] = [];
    for (const candidate of candidates) {
      const deleteResult = await this.prisma.media.deleteMany({
        where: {
          id: candidate.id,
          ...this.buildOrphanWhere(threshold),
        },
      });

      if (deleteResult.count === 0) {
        skippedInUseCount += 1;
        items.push({
          id: candidate.id,
          storageKey: candidate.storageKey,
          cdnUrl: candidate.cdnUrl,
          status: 'skipped_in_use',
          reason: 'Media received a reference before deletion',
        });
        continue;
      }

      deletedCount += 1;
      const fileResult = await this.tryDeleteStoredFile(candidate.storageKey);
      if (fileResult === 'deleted') {
        fileDeletedCount += 1;
        items.push({
          id: candidate.id,
          storageKey: candidate.storageKey,
          cdnUrl: candidate.cdnUrl,
          status: 'deleted',
        });
        continue;
      }

      if (fileResult === 'missing') {
        fileMissingCount += 1;
        items.push({
          id: candidate.id,
          storageKey: candidate.storageKey,
          cdnUrl: candidate.cdnUrl,
          status: 'deleted_file_missing',
        });
        continue;
      }

      fileDeleteErrorCount += 1;
      items.push({
        id: candidate.id,
        storageKey: candidate.storageKey,
        cdnUrl: candidate.cdnUrl,
        status: 'deleted_file_error',
      });
    }

    return {
      dryRun: false,
      olderThanHours,
      threshold: threshold.toISOString(),
      scannedCount: candidates.length,
      deletedCount,
      skippedInUseCount,
      fileDeletedCount,
      fileMissingCount,
      fileDeleteErrorCount,
      items,
    };
  }

  private getCookieToken(request: Request): string | null {
    const rawCookies = request.cookies as Record<string, unknown> | undefined;
    const token = rawCookies?.[ADMIN_AUTH_COOKIE];
    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  private getAuthCookieDomain(): string | undefined {
    const explicit = process.env.ADMIN_AUTH_COOKIE_DOMAIN;
    const normalizedExplicit = this.normalizeCookieDomain(explicit);
    if (normalizedExplicit) {
      return normalizedExplicit;
    }

    const configuredFrontendOrigin = process.env.FRONTEND_ORIGIN
      ?.split(',')[0]
      ?.trim();
    if (!configuredFrontendOrigin) {
      return undefined;
    }

    try {
      const host = new URL(configuredFrontendOrigin).hostname;
      return this.normalizeCookieDomain(host);
    } catch {
      return undefined;
    }
  }

  private normalizeCookieDomain(raw: string | undefined): string | undefined {
    if (!raw || typeof raw !== 'string') {
      return undefined;
    }

    let domain = raw.trim();
    if (!domain) {
      return undefined;
    }

    if (domain.startsWith('http://') || domain.startsWith('https://')) {
      try {
        domain = new URL(domain).hostname;
      } catch {
        return undefined;
      }
    }

    domain = domain.replace(/:\d+$/, '').replace(/\.$/, '').trim();
    if (!domain) {
      return undefined;
    }

    if (domain === 'localhost' || /^[\d.]+$/.test(domain)) {
      return undefined;
    }

    return domain.startsWith('.') ? domain : `.${domain}`;
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

  private buildOrphanWhere(threshold?: Date) {
    return {
      services: { none: {} },
      doctors: { none: {} },
      blogPosts: { none: {} },
      galleryItems: { none: {} },
      ...(threshold ? { createdAt: { lt: threshold } } : {}),
    };
  }

  private toMediaUsageSummary(counts: {
    services: number;
    doctors: number;
    blogPosts: number;
    galleryItems: number;
  }): MediaUsageSummary {
    return {
      services: counts.services,
      doctors: counts.doctors,
      blogPosts: counts.blogPosts,
      galleryItems: counts.galleryItems,
      total: counts.services + counts.doctors + counts.blogPosts + counts.galleryItems,
    };
  }

  private parsePositiveIntWithinRange(
    raw: string | undefined,
    fallback: number,
    min: number,
    max: number,
  ): number {
    const parsed = Number.parseInt(raw ?? '', 10);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
  }

  private parseBooleanFlag(raw: string | undefined): boolean {
    if (!raw) {
      return false;
    }
    return raw === '1' || raw.toLowerCase() === 'true';
  }

  private getMediaCleanupGraceHours(): number {
    const parsed = Number.parseInt(
      process.env.MEDIA_CLEANUP_GRACE_HOURS ??
        String(DEFAULT_MEDIA_CLEANUP_GRACE_HOURS),
      10,
    );
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 24 * 30) {
      return DEFAULT_MEDIA_CLEANUP_GRACE_HOURS;
    }
    return parsed;
  }

  private getMediaCleanupBatchLimit(): number {
    const parsed = Number.parseInt(
      process.env.MEDIA_CLEANUP_BATCH_LIMIT ??
        String(DEFAULT_MEDIA_CLEANUP_BATCH_LIMIT),
      10,
    );
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 500) {
      return DEFAULT_MEDIA_CLEANUP_BATCH_LIMIT;
    }
    return parsed;
  }

  private async tryDeleteStoredFile(
    storageKey: string,
  ): Promise<'deleted' | 'missing' | 'error'> {
    const absolutePath = join(this.uploadRoot, storageKey);
    if (!existsSync(absolutePath)) {
      return 'missing';
    }

    try {
      await unlink(absolutePath);
      return 'deleted';
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown file delete error';
      this.logger.error(`Failed to delete media file: ${absolutePath} (${message})`);
      return 'error';
    }
  }

  private parseSessionPayload(
    token: string,
    options?: { ignoreExpiration?: boolean },
  ): AuthSessionPayload {
    try {
      const decoded = verify(token, this.getJwtSecret(), {
        ignoreExpiration: options?.ignoreExpiration ?? false,
        issuer: this.getJwtIssuer(),
        audience: this.getJwtAudience(),
      });

      if (!decoded || typeof decoded !== 'object') {
        this.throwHttpError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_TOKEN_INVALID',
          'Invalid admin session token',
        );
      }

      const payload = decoded as Partial<AuthSessionPayload>;
      if (!payload.sub || !payload.sid || !payload.email) {
        this.throwHttpError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_TOKEN_MALFORMED',
          'Malformed admin session token',
        );
      }

      return {
        sub: payload.sub,
        sid: payload.sid,
        email: payload.email,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof TokenExpiredError) {
        this.throwHttpError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_TOKEN_EXPIRED',
          'Admin session token expired',
        );
      }

      this.throwHttpError(
        HttpStatus.UNAUTHORIZED,
        'AUTH_TOKEN_INVALID',
        'Invalid admin session token',
      );
    }
  }

  private extractIpAddress(request: Request): string | null {
    const xForwardedFor = request.headers['x-forwarded-for'];
    const shouldUseForwarded = this.getTrustProxy();
    const forwardedIp =
      shouldUseForwarded && typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0]?.trim()
        : null;

    const ip = forwardedIp || request.ip || request.socket?.remoteAddress || null;
    return this.normalizeNullableText(ip);
  }

  private extractOrigin(request: Request): string | null {
    const originHeader = request.headers.origin;
    if (typeof originHeader === 'string' && originHeader.trim().length > 0) {
      return this.toOrigin(originHeader);
    }

    const refererHeader = request.headers.referer;
    if (typeof refererHeader === 'string' && refererHeader.trim().length > 0) {
      return this.toOrigin(refererHeader);
    }

    return null;
  }

  private toOrigin(rawUrl: string): string | null {
    try {
      return new URL(rawUrl).origin;
    } catch {
      return null;
    }
  }

  private isMutationMethod(methodRaw: string): boolean {
    const method = methodRaw.toUpperCase();
    return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
  }

  private getAllowedOrigins(): Set<string> {
    const fromEnv = [
      process.env.FRONTEND_ORIGIN,
      process.env.NEXT_PUBLIC_FRONTEND_ORIGIN,
      process.env.NEXT_PUBLIC_APP_URL,
    ];
    const defaultLocalhost = `http://localhost:${process.env.FRONTEND_PORT ?? '3333'}`;
    const candidates = [...fromEnv, defaultLocalhost];

    const normalized = candidates
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0)
      .map((item) => this.toOrigin(item))
      .filter((item): item is string => Boolean(item));

    return new Set(normalized);
  }

  private normalizeNullableText(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();
    if (!normalized) {
      return null;
    }

    return normalized.slice(0, 512);
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
      this.throwHttpError(
        HttpStatus.BAD_REQUEST,
        'AUTH_CREDENTIALS_REQUIRED',
        'Email and password are required',
      );
    }

    if (!email.includes('@') || email.length > 180) {
      this.throwHttpError(HttpStatus.BAD_REQUEST, 'AUTH_INVALID_EMAIL', 'Invalid email');
    }

    if (password.length < 8 || password.length > 128) {
      this.throwHttpError(
        HttpStatus.BAD_REQUEST,
        'AUTH_INVALID_PASSWORD',
        'Invalid password',
      );
    }
  }

  private assertLoginNotRateLimited(attemptKey: string): void {
    const state = this.loginAttempts.get(attemptKey);
    if (!state || !state.blockedUntilMs) {
      return;
    }

    const now = Date.now();
    if (state.blockedUntilMs > now) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((state.blockedUntilMs - now) / 1000),
      );
      this.throwHttpError(
        HttpStatus.TOO_MANY_REQUESTS,
        'AUTH_LOGIN_RATE_LIMITED',
        'Too many failed login attempts. Please try again later.',
        { retryAfterSeconds },
      );
    }

    this.loginAttempts.delete(attemptKey);
  }

  private markFailedLogin(attemptKey: string): void {
    const now = Date.now();
    const existingState = this.loginAttempts.get(attemptKey);
    const lockWindowMs = this.getLoginLockWindowMinutes() * 60 * 1000;

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

  private pruneLoginAttempts(): void {
    if (this.loginAttempts.size === 0) {
      return;
    }

    const now = Date.now();
    const lockWindowMs = this.getLoginLockWindowMinutes() * 60 * 1000;

    for (const [attemptKey, state] of this.loginAttempts.entries()) {
      const isExpired = now - state.firstAttemptAtMs > lockWindowMs;
      const isBlockFinished = !state.blockedUntilMs || state.blockedUntilMs <= now;
      if (isExpired && isBlockFinished) {
        this.loginAttempts.delete(attemptKey);
      }
    }
  }

  private async revokeSessionById(sessionId: string): Promise<void> {
    await this.prisma.adminSession.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private async enforceMaxActiveSessions(adminId: string, currentSessionId: string): Promise<void> {
    const maxSessions = this.getMaxActiveSessions();
    const activeSessions = await this.prisma.adminSession.findMany({
      where: {
        adminId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: [{ createdAt: 'desc' }],
      select: { id: true },
    });

    if (activeSessions.length <= maxSessions) {
      return;
    }

    const sessionsToRevoke = activeSessions
      .slice(maxSessions)
      .map((session: { id: string }) => session.id)
      .filter((sessionId: string) => sessionId !== currentSessionId);

    if (sessionsToRevoke.length === 0) {
      return;
    }

    await this.prisma.adminSession.updateMany({
      where: {
        id: { in: sessionsToRevoke },
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
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

  private getMaxActiveSessions(): number {
    const maxSessions = Number.parseInt(
      process.env.ADMIN_MAX_ACTIVE_SESSIONS ??
        String(DEFAULT_ADMIN_MAX_ACTIVE_SESSIONS),
      10,
    );
    if (!Number.isFinite(maxSessions) || maxSessions < 1 || maxSessions > 20) {
      return DEFAULT_ADMIN_MAX_ACTIVE_SESSIONS;
    }
    return maxSessions;
  }

  private getRequireOriginForMutations(): boolean {
    const flag = process.env.ADMIN_REQUIRE_ORIGIN_FOR_MUTATIONS;
    if (typeof flag !== 'string') {
      return DEFAULT_ADMIN_REQUIRE_ORIGIN_FOR_MUTATIONS;
    }
    return flag === '1' || flag.toLowerCase() === 'true';
  }

  private getEnforceIpBinding(): boolean {
    const flag = process.env.ADMIN_ENFORCE_IP_BINDING;
    if (typeof flag !== 'string') {
      return DEFAULT_ADMIN_ENFORCE_IP_BINDING;
    }
    return flag === '1' || flag.toLowerCase() === 'true';
  }

  private getTrustProxy(): boolean {
    const flag = process.env.TRUST_PROXY;
    if (typeof flag !== 'string') {
      return false;
    }
    return flag === '1' || flag.toLowerCase() === 'true';
  }

  private getJwtIssuer(): string {
    return process.env.JWT_ISSUER?.trim() || 'ultramed-admin-api';
  }

  private getJwtAudience(): string {
    return process.env.JWT_AUDIENCE?.trim() || 'ultramed-admin';
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 24) {
      this.throwHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'AUTH_CONFIG_INVALID',
        'Server authentication configuration is invalid',
      );
    }
    return secret;
  }

  private throwHttpError(
    statusCode: HttpStatus,
    code: string,
    message: string,
    details: unknown = null,
  ): never {
    throw new HttpException(
      {
        code,
        message,
        details,
      },
      statusCode,
    );
  }
}
