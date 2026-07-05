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
import { parseCreateContactInfoDto, parseCreateContactMessageDto, parseUpdateContactInfoDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

  @UseGuards(AdminAuthGuard)
  @Get('admin/all')
  getAdminContacts() {
    return this.contactService.getAdminContacts();
  }

  @UseGuards(AdminAuthGuard)
  @Get('messages/admin/all')
  getAdminMessages(@Query('limit') limit?: string) {
    return this.contactService.getAdminMessages(limit);
  }

  @UseGuards(AdminAuthGuard)
  @Post('messages/admin/delete-many')
  removeAdminMessages(@Body() body: unknown) {
    return this.contactService.removeAdminMessages(body);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('messages/admin/:id')
  removeAdminMessage(@Param('id') id: string) {
    return this.contactService.removeAdminMessage(id);
  }

  @Get()
  getContact(
    @Query('locale') locale = 'az',
    @Query('slug') slug = 'main',
  ) {
    return this.contactService.getContact(locale, slug);
  }

  @Post('messages')
  createMessage(@Body() body: unknown) {
    const data = parseCreateContactMessageDto(body);
    return this.contactService.createMessage(data);
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
