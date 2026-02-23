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

    @UseGuards(AdminAuthGuard)
    @Post()
    create(@Body() data: any) {
        return this.doctorsService.create(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.doctorsService.update(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.doctorsService.remove(id);
    }
}
