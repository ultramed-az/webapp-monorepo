import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminService } from './admin.service';

export type AuthenticatedAdminRequest = Request & {
  admin: {
    id: string;
    email: string;
    sessionId: string;
  };
};

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedAdminRequest>();
    const requestContext = this.adminService.getRequestContext(request);
    this.adminService.assertValidMutationOrigin(requestContext);
    const token = this.adminService.extractToken(request);

    if (!token) {
      throw new HttpException(
        {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
          details: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const session = await this.adminService.validateSessionToken(token, {
      ipAddress: requestContext.ipAddress,
      userAgent: requestContext.userAgent,
    });
    request.admin = {
      id: session.admin.id,
      email: session.admin.email,
      sessionId: session.id,
    };

    return true;
  }
}
