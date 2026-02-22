import { Controller, Get, Query } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Get()
    getContact(@Query('locale') locale = 'az') {
        return this.contactService.getContact(locale);
    }
}

