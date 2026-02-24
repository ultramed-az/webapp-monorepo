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
import { parseCreateDoctorDto, parseUpdateDoctorDto } from './dto/doctor.dto';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @UseGuards(AdminAuthGuard)
    @Get('admin/all')
    findAllAdmin() {
        return this.doctorsService.findAllAdmin();
    }

    @UseGuards(AdminAuthGuard)
    @Get('admin/:id')
    findOneAdmin(@Param('id') id: string) {
        return this.doctorsService.findOneAdmin(id);
    }

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
    create(@Body() body: unknown) {
        const data = parseCreateDoctorDto(body);
        return this.doctorsService.create(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: unknown) {
        const data = parseUpdateDoctorDto(body);
        return this.doctorsService.update(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.doctorsService.remove(id);
    }
}
