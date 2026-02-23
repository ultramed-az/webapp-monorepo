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
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

  @Get()
  getContact(
    @Query('locale') locale = 'az',
    @Query('slug') slug = 'main',
  ) {
    return this.contactService.getContact(locale, slug);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.contactService.create(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':slug')
  update(@Param('slug') slug: string, @Body() data: any) {
    return this.contactService.update(slug, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.contactService.remove(slug);
  }
}
