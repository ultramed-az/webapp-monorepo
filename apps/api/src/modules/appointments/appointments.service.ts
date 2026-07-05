import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentRequestDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentRequestDto) {
    const appointment = await this.prisma.appointmentRequest.create({
      data,
    });

    return {
      id: appointment.id,
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
    };
  }
}
