import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
    const requestContext = this.adminService.getRequestContext(request);
    this.adminService.assertValidMutationOrigin(requestContext);

    const session = await this.adminService.login(body.email, body.password, {
      ipAddress: requestContext.ipAddress,
      userAgent: requestContext.userAgent,
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
  @Get('sessions')
  listSessions(@Req() request: AuthenticatedAdminRequest) {
    return this.adminService.listAdminSessions(
      request.admin.id,
      request.admin.sessionId,
    );
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
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  async logoutAll(
    @Req() request: AuthenticatedAdminRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.adminService.logoutAll(request.admin.id);
    response.clearCookie(
      this.adminService.getAuthCookieName(),
      this.adminService.getAuthCookieOptions(new Date(0)),
    );
    return { success: true };
  }

  @UseGuards(AdminAuthGuard)
  @Delete('sessions/:id')
  revokeSession(
    @Req() request: AuthenticatedAdminRequest,
    @Param('id') sessionId: string,
  ) {
    return this.adminService.revokeAdminSession(request.admin.id, sessionId);
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
            new HttpException(
              {
                code: 'MEDIA_UNSUPPORTED_FILE_TYPE',
                message: 'Unsupported file type. Allowed: JPG, PNG, WEBP, SVG, AVIF',
                details: { mimeType: file.mimetype },
              },
              HttpStatus.BAD_REQUEST,
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
      throw new HttpException(
        {
          code: 'MEDIA_FILE_REQUIRED',
          message: 'File is required',
          details: null,
        },
        HttpStatus.BAD_REQUEST,
      );
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
  listMedia(
    @Query('limit') limit?: string,
    @Query('orphansOnly') orphansOnly?: string,
    @Query('olderThanHours') olderThanHours?: string,
  ) {
    return this.adminService.listMedia({
      limitRaw: limit,
      orphanOnlyRaw: orphansOnly,
      olderThanHoursRaw: olderThanHours,
    });
  }

  @UseGuards(AdminAuthGuard)
  @Delete('media/:id')
  removeMedia(@Param('id') id: string) {
    return this.adminService.removeMedia(id);
  }

  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('media/cleanup-orphans')
  cleanupOrphanMedia(
    @Query('limit') limit?: string,
    @Query('olderThanHours') olderThanHours?: string,
    @Query('dryRun') dryRun?: string,
  ) {
    return this.adminService.cleanupOrphanMedia({
      limitRaw: limit,
      olderThanHoursRaw: olderThanHours,
      dryRunRaw: dryRun,
    });
  }
}
