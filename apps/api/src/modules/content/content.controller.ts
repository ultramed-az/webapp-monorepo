import { Controller, Get, Query } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

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
}

