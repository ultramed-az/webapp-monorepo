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
import { parseCreateContactInfoDto, parseUpdateContactInfoDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

  @UseGuards(AdminAuthGuard)
  @Get('admin/all')
  getAdminContacts() {
    return this.contactService.getAdminContacts();
  }

  @Get()
  getContact(
    @Query('locale') locale = 'az',
    @Query('slug') slug = 'main',
  ) {
    return this.contactService.getContact(locale, slug);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() body: unknown) {
    const data = parseCreateContactInfoDto(body);
    return this.contactService.create(data);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':slug')
  update(@Param('slug') slug: string, @Body() body: unknown) {
    const data = parseUpdateContactInfoDto(body);
    return this.contactService.update(slug, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.contactService.remove(slug);
  }
}
