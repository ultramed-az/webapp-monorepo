import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { AppointmentsService } from './appointments.service';
import { parseCreateAppointmentRequestDto } from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AdminAuthGuard)
  @Get('admin/all')
  listAdmin(@Query('limit') limit?: string) {
    return this.appointmentsService.listAdmin(limit);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/delete-many')
  removeMany(@Body() body: unknown) {
    return this.appointmentsService.removeManyAdmin(body);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('admin/:id')
  removeAdmin(@Param('id') id: string) {
    return this.appointmentsService.removeAdmin(id);
  }

  @Post()
  create(@Body() body: unknown) {
    const data = parseCreateAppointmentRequestDto(body);
    return this.appointmentsService.create(data);
  }
}
