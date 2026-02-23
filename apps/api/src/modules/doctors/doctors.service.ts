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

    async findOne(id: string, localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);

        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
        });

        if (!doctor || !doctor.isPublished) {
            return null;
        }

        return {
            id: doctor.id,
            name: doctor.name,
            specialty: this.pickLocalizedField(doctor, 'title', locale) ?? doctor.specialty,
            bio: this.pickLocalizedField(doctor, 'bio', locale) ?? '',
            profile: this.pickLocalizedField(doctor, 'profile', locale) ?? '',
            experience: doctor.experience ?? '',
            education: this.pickLocalizedField(doctor, 'education', locale) ?? '',
            room: this.pickLocalizedField(doctor, 'room', locale) ?? '',
            schedule: this.pickLocalizedStringArray(doctor, 'schedule', locale),
            languages: this.pickLocalizedStringArray(doctor, 'languages', locale),
            procedures: this.pickLocalizedStringArray(doctor, 'procedures', locale),
            tags: this.pickLocalizedTags(doctor, locale),
            phone: doctor.phone ?? '',
            email: doctor.email ?? '',
            image: doctor.image,
        };
    }

    async create(data: any) {
        return this.prisma.doctor.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.doctor.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.doctor.delete({
            where: { id },
        });
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
            profileAz: string | null;
            profileEn: string | null;
            profileRu: string | null;
            educationAz: string | null;
            educationEn: string | null;
            educationRu: string | null;
            roomAz: string | null;
            roomEn: string | null;
            roomRu: string | null;
        },
        base: 'title' | 'bio' | 'education' | 'profile' | 'room',
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

        if (base === 'profile') {
            if (locale === 'en') return doctor.profileEn;
            if (locale === 'ru') return doctor.profileRu;
            return doctor.profileAz;
        }

        if (base === 'room') {
            if (locale === 'en') return doctor.roomEn;
            if (locale === 'ru') return doctor.roomRu;
            return doctor.roomAz;
        }

        if (locale === 'en') return doctor.educationEn;
        if (locale === 'ru') return doctor.educationRu;
        return doctor.educationAz;
    }

    private pickLocalizedStringArray(
        doctor: {
            scheduleAz: unknown;
            scheduleEn: unknown;
            scheduleRu: unknown;
            languagesAz: unknown;
            languagesEn: unknown;
            languagesRu: unknown;
            proceduresAz: unknown;
            proceduresEn: unknown;
            proceduresRu: unknown;
        },
        base: 'schedule' | 'languages' | 'procedures',
        locale: 'az' | 'en' | 'ru',
    ): string[] {
        let raw: unknown;

        if (base === 'schedule') {
            raw = locale === 'en' ? doctor.scheduleEn : locale === 'ru' ? doctor.scheduleRu : doctor.scheduleAz;
        } else if (base === 'languages') {
            raw = locale === 'en' ? doctor.languagesEn : locale === 'ru' ? doctor.languagesRu : doctor.languagesAz;
        } else {
            raw = locale === 'en' ? doctor.proceduresEn : locale === 'ru' ? doctor.proceduresRu : doctor.proceduresAz;
        }

        if (Array.isArray(raw)) {
            return raw.filter((item): item is string => typeof item === 'string');
        }

        return [];
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
