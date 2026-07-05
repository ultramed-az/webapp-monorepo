import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentRequestDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAdmin(limitRaw?: string) {
    const appointments = await this.prisma.appointmentRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: this.normalizeLimit(limitRaw),
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      fullName: appointment.fullName,
      email: appointment.email,
      phone: appointment.phone,
      serviceId: appointment.serviceId,
      serviceTitle: appointment.serviceTitle,
      preferredDate: appointment.preferredDate,
      preferredTime: appointment.preferredTime,
      message: appointment.message,
      locale: appointment.locale,
      source: appointment.source,
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }));
  }

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

  private normalizeLimit(limitRaw?: string): number {
    const parsed = Number.parseInt(limitRaw ?? '', 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 200;
    }
    return Math.min(parsed, 500);
  }
}
