import { Controller, Get, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Get()
    findAll(@Query('locale') locale = 'az') {
        return this.doctorsService.findAll(locale);
    }
}
