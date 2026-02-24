import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHomeStatDto, UpdateHomeStatDto } from './dto/home.dto';

@Injectable()
export class HomeService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        const stats = await this.prisma.homeStat.findMany({
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        });

        return stats.map((stat) => ({
            id: stat.id,
            value: stat.value,
        }));
    }

    async createStat(data: CreateHomeStatDto) {
        return this.prisma.homeStat.create({
            data,
        });
    }

    async updateStat(id: string, data: UpdateHomeStatDto) {
        return this.prisma.homeStat.update({
            where: { id },
            data,
        });
    }

    async removeStat(id: string) {
        return this.prisma.homeStat.delete({
            where: { id },
        });
    }
}
