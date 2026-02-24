import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { ServicesService } from './services.service';
import { parseCreateServiceDto, parseUpdateServiceDto } from './dto/service.dto';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @UseGuards(AdminAuthGuard)
    @Get('admin/all')
    findAllAdmin() {
        return this.servicesService.findAllAdmin();
    }

    @UseGuards(AdminAuthGuard)
    @Get('admin/:id')
    findOneAdmin(@Param('id') id: string) {
        return this.servicesService.findOneAdmin(id);
    }

    @Get()
    findAll(@Query('locale') locale = 'az') {
        return this.servicesService.findAll(locale);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('locale') locale = 'az') {
        return this.servicesService.findOne(id, locale);
    }

    @UseGuards(AdminAuthGuard)
    @Post()
    create(@Body() body: unknown) {
        const data = parseCreateServiceDto(body);
        return this.servicesService.create(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: unknown) {
        const data = parseUpdateServiceDto(body);
        return this.servicesService.update(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
