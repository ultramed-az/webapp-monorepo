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
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(AdminAuthGuard)
  @Get('admin/testimonials')
  getTestimonialsAdmin() {
    return this.contentService.getTestimonialsAdmin();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/pages')
  getPagesAdmin() {
    return this.contentService.getPagesAdmin();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/pages/:slug')
  getPageBySlugAdmin(@Param('slug') slug: string) {
    return this.contentService.getPageBySlugAdmin(slug);
  }

  @Get('testimonials')
  getTestimonials(@Query('locale') locale = 'az') {
    return this.contentService.getTestimonials(locale);
  }

  @Get('privacy-policy')
  getPrivacyPolicy(@Query('locale') locale = 'az') {
    return this.contentService.getPrivacyPolicy(locale);
  }

  @Get('terms-of-service')
  getTermsOfService(@Query('locale') locale = 'az') {
    return this.contentService.getTermsOfService(locale);
  }

  @UseGuards(AdminAuthGuard)
  @Post('testimonials')
  createTestimonial(@Body() data: any) {
    return this.contentService.createTestimonial(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put('testimonials/:id')
  updateTestimonial(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateTestimonial(id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('testimonials/:id')
  removeTestimonial(@Param('id') id: string) {
    return this.contentService.removeTestimonial(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post('pages')
  createPage(@Body() data: any) {
    return this.contentService.createPage(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put('pages/:slug')
  updatePage(@Param('slug') slug: string, @Body() data: any) {
    return this.contentService.updatePage(slug, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('pages/:slug')
  removePage(@Param('slug') slug: string) {
    return this.contentService.removePage(slug);
  }
}
