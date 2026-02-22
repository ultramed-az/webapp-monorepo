import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServicesModule } from './modules/services/services.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [PrismaModule, AdminModule, ServicesModule, DoctorsModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
