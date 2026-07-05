import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async removeAdmin(id: string) {
    const appointment = await this.prisma.appointmentRequest.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment request not found');
    }

    await this.prisma.appointmentRequest.delete({
      where: { id },
    });

    return { id };
  }

  async removeManyAdmin(body: unknown) {
    const ids = this.normalizeIdsPayload(body);
    const result = await this.prisma.appointmentRequest.deleteMany({
      where: { id: { in: ids } },
    });

    return { deletedCount: result.count };
  }

  private normalizeLimit(limitRaw?: string): number {
    const parsed = Number.parseInt(limitRaw ?? '', 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 200;
    }
    return Math.min(parsed, 500);
  }

  private normalizeIdsPayload(body: unknown): string[] {
    if (!body || typeof body !== 'object' || !Array.isArray((body as { ids?: unknown }).ids)) {
      throw new BadRequestException('ids array is required');
    }

    const ids = Array.from(
      new Set(
        (body as { ids: unknown[] }).ids
          .filter((id): id is string => typeof id === 'string')
          .map((id) => id.trim())
          .filter(Boolean),
      ),
    );

    if (ids.length === 0) {
      throw new BadRequestException('ids array cannot be empty');
    }

    return ids;
  }
}
