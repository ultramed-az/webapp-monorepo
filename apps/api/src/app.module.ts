import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServicesModule } from './modules/services/services.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { HomeModule } from './modules/home/home.module';
import { ContentModule } from './modules/content/content.module';
import { FaqModule } from './modules/faq/faq.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    ServicesModule,
    DoctorsModule,
    BlogModule,
    ContactModule,
    HomeModule,
    ContentModule,
    FaqModule,
    GalleryModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
