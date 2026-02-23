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
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @UseGuards(AdminAuthGuard)
  @Get('admin/all')
  findAllAdmin() {
    return this.faqService.findAllAdmin();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.faqService.findOneAdmin(id);
  }

  @Get()
  findAll(@Query('locale') locale = 'az') {
    return this.faqService.findAll(locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale = 'az') {
    return this.faqService.findOne(id, locale);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.faqService.create(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.faqService.update(id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
