import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from './admin-auth.guard';
import type { AuthenticatedAdminRequest } from './admin-auth.guard';

const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIRECTORY = join(process.cwd(), 'uploads');
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/avif',
]);

function createFileName(originalName: string): string {
  const randomPart = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = extname(originalName)?.toLowerCase() || '.bin';
  return `${randomPart}${extension}`;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const xForwardedFor = request.headers['x-forwarded-for'];
    const forwardedIp =
      typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0]?.trim()
        : null;

    const session = await this.adminService.login(body.email, body.password, {
      ipAddress: forwardedIp ?? request.ip ?? null,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : null,
    });

    response.cookie(
      this.adminService.getAuthCookieName(),
      session.token,
      this.adminService.getAuthCookieOptions(session.expiresAt),
    );

    return {
      success: true,
      admin: session.admin,
      expiresAt: session.expiresAt.toISOString(),
    };
  }

  @UseGuards(AdminAuthGuard)
  @Get('session')
  getSession(@Req() request: AuthenticatedAdminRequest) {
    return {
      authenticated: true,
      admin: request.admin,
    };
  }

  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.adminService.extractToken(request);
    if (token) {
      await this.adminService.logout(token);
    }

    response.clearCookie(
      this.adminService.getAuthCookieName(),
      this.adminService.getAuthCookieOptions(new Date(0)),
    );

    return { success: true };
  }

  @UseGuards(AdminAuthGuard)
  @Post('media/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const dateBucket = new Date().toISOString().slice(0, 10);
          const destination = join(UPLOAD_DIRECTORY, dateBucket);
          mkdirSync(destination, { recursive: true });
          callback(null, destination);
        },
        filename: (_request, file, callback) => {
          callback(null, createFileName(file.originalname));
        },
      }),
      fileFilter: (_request, file, callback) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          callback(
            new BadRequestException(
              'Unsupported file type. Allowed: JPG, PNG, WEBP, SVG, AVIF',
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: MAX_UPLOAD_SIZE_BYTES,
      },
    }),
  )
  async uploadMedia(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const media = await this.adminService.registerMedia(file);
    return {
      id: media.id,
      url: media.cdnUrl,
      storageKey: media.storageKey,
      mimeType: media.mimeType,
      size: media.size,
    };
  }

  @UseGuards(AdminAuthGuard)
  @Get('media')
  listMedia(@Query('limit') limit?: string) {
    return this.adminService.listMedia(limit);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('media/:id')
  removeMedia(@Param('id') id: string) {
    return this.adminService.removeMedia(id);
  }
}
