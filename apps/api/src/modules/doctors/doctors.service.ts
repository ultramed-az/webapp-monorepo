import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);

        const doctors = await this.prisma.doctor.findMany({
            where: { isPublished: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });

        return doctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.name,
            specialty: this.pickLocalizedField(doctor, 'title', locale) ?? doctor.specialty,
            bio: this.pickLocalizedField(doctor, 'bio', locale) ?? '',
            experience: doctor.experience ?? '',
            education: this.pickLocalizedField(doctor, 'education', locale) ?? '',
            tags: this.pickLocalizedTags(doctor, locale),
            image: doctor.image,
        }));
    }

    private normalizeLocale(locale: string): 'az' | 'en' | 'ru' {
        if (locale === 'en' || locale === 'ru') {
            return locale;
        }
        return 'az';
    }

    private pickLocalizedField(
        doctor: {
            titleAz: string;
            titleEn: string;
            titleRu: string;
            bioAz: string;
            bioEn: string;
            bioRu: string;
            educationAz: string | null;
            educationEn: string | null;
            educationRu: string | null;
        },
        base: 'title' | 'bio' | 'education',
        locale: 'az' | 'en' | 'ru',
    ): string | null {
        if (base === 'title') {
            if (locale === 'en') return doctor.titleEn;
            if (locale === 'ru') return doctor.titleRu;
            return doctor.titleAz;
        }

        if (base === 'bio') {
            if (locale === 'en') return doctor.bioEn;
            if (locale === 'ru') return doctor.bioRu;
            return doctor.bioAz;
        }

        if (locale === 'en') return doctor.educationEn;
        if (locale === 'ru') return doctor.educationRu;
        return doctor.educationAz;
    }

    private pickLocalizedTags(
        doctor: {
            tagsAz: unknown;
            tagsEn: unknown;
            tagsRu: unknown;
        },
        locale: 'az' | 'en' | 'ru',
    ): string[] {
        const raw =
            locale === 'en'
                ? doctor.tagsEn
                : locale === 'ru'
                    ? doctor.tagsRu
                    : doctor.tagsAz;

        if (Array.isArray(raw)) {
            return raw.filter((tag): tag is string => typeof tag === 'string');
        }

        return [];
    }
}
