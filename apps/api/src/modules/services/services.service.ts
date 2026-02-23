import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) { }

    async findAll(localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);
        const services = await this.prisma.service.findMany({
            where: { isPublished: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });

        return services.map((service) => ({
            id: service.id,
            title: this.pickLocalizedField(service, 'title', locale),
            summary: this.pickLocalizedField(service, 'summary', locale),
            iconKey: service.iconKey,
            image: service.image,
        }));
    }

    async findOne(id: string, localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);
        const service = await this.prisma.service.findUnique({ where: { id } });
        if (!service || !service.isPublished) {
            return null;
        }

        return {
            id: service.id,
            title: this.pickLocalizedField(service, 'title', locale),
            summary: this.pickLocalizedField(service, 'summary', locale),
            content: this.pickLocalizedField(service, 'content', locale),
            highlights: this.pickLocalizedHighlights(service, locale),
            iconKey: service.iconKey,
            image: service.image,
        };
    }

    async create(data: any) {
        return this.prisma.service.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.service.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.service.delete({ where: { id } });
    }

    private normalizeLocale(locale: string): 'az' | 'en' | 'ru' {
        if (locale === 'en' || locale === 'ru') {
            return locale;
        }
        return 'az';
    }

    private pickLocalizedField(
        service: {
            titleAz: string;
            titleEn: string;
            titleRu: string;
            summaryAz: string;
            summaryEn: string;
            summaryRu: string;
            contentAz: string;
            contentEn: string;
            contentRu: string;
        },
        base: 'title' | 'summary' | 'content',
        locale: 'az' | 'en' | 'ru',
    ): string {
        if (base === 'title') {
            if (locale === 'en') return service.titleEn;
            if (locale === 'ru') return service.titleRu;
            return service.titleAz;
        }

        if (base === 'summary') {
            if (locale === 'en') return service.summaryEn;
            if (locale === 'ru') return service.summaryRu;
            return service.summaryAz;
        }

        if (locale === 'en') return service.contentEn;
        if (locale === 'ru') return service.contentRu;
        return service.contentAz;
    }

    private pickLocalizedHighlights(
        service: {
            highlightsAz: unknown;
            highlightsEn: unknown;
            highlightsRu: unknown;
        },
        locale: 'az' | 'en' | 'ru',
    ): string[] {
        const raw =
            locale === 'en'
                ? service.highlightsEn
                : locale === 'ru'
                    ? service.highlightsRu
                    : service.highlightsAz;

        if (!Array.isArray(raw)) {
            return [];
        }

        return raw.filter((item): item is string => typeof item === 'string');
    }
}
