import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(AdminAuthGuard)
  @Get('admin/all')
  findAllAdmin() {
    return this.galleryService.findAllAdmin();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.galleryService.findOneAdmin(id);
  }

  @Get()
  findAll(@Query('locale') locale = 'az') {
    return this.galleryService.findAll(locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale = 'az') {
    return this.galleryService.findOne(id, locale);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.galleryService.create(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.galleryService.update(id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
