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
import { parseCreateFaqDto, parseUpdateFaqDto } from './dto/faq.dto';

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
  create(@Body() body: unknown) {
    const data = parseCreateFaqDto(body);
    return this.faqService.create(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const data = parseUpdateFaqDto(body);
    return this.faqService.update(id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
