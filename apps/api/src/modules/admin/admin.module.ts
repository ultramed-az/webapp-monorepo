import { Global, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Global()
@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminAuthGuard],
  exports: [AdminAuthGuard, AdminService],
})
export class AdminModule {}
