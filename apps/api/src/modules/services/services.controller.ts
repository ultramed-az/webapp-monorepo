import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    findAll(@Query('locale') locale = 'az') {
        return this.servicesService.findAll(locale);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('locale') locale = 'az') {
        return this.servicesService.findOne(id, locale);
    }

    @Post()
    create(@Body() data: any) {
        return this.servicesService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.servicesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
