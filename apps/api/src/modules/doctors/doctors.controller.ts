import { Controller, Get, Param, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Get()
    findAll(@Query('locale') locale = 'az') {
        return this.doctorsService.findAll(locale);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('locale') locale = 'az') {
        return this.doctorsService.findOne(id, locale);
    }
}
