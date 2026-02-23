import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
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
    const token = this.adminService.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const session = await this.adminService.validateSessionToken(token);
    request.admin = {
      id: session.admin.id,
      email: session.admin.email,
      sessionId: session.id,
    };

    return true;
  }
}
