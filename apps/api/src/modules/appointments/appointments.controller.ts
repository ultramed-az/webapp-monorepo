import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { parseCreateAppointmentRequestDto } from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() body: unknown) {
    const data = parseCreateAppointmentRequestDto(body);
    return this.appointmentsService.create(data);
  }
}
