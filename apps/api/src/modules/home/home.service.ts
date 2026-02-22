import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}

