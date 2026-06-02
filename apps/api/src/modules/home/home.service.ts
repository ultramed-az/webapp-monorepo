import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateAnnouncementDto,
    CreateCheckupPackageDto,
    CreateHomeStatDto,
    UpdateAnnouncementDto,
    UpdateCheckupPackageDto,
    UpdateHomeStatDto,
} from './dto/home.dto';

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

    async getAnnouncements(localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);
        const announcements = await this.prisma.announcement.findMany({
            where: { isPublished: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });

        return announcements.map((announcement) => ({
            id: announcement.id,
            text: this.pickLocalizedText(
                locale,
                announcement.textAz,
                announcement.textEn,
                announcement.textRu,
            ),
            href: announcement.href,
        }));
    }

    async findAllAnnouncementsAdmin() {
        return this.prisma.announcement.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }

    async createAnnouncement(data: CreateAnnouncementDto) {
        return this.prisma.announcement.create({ data });
    }

    async updateAnnouncement(id: string, data: UpdateAnnouncementDto) {
        return this.prisma.announcement.update({
            where: { id },
            data,
        });
    }

    async removeAnnouncement(id: string) {
        return this.prisma.announcement.delete({
            where: { id },
        });
    }

    async getCheckupPackages(localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);
        const packages = await this.prisma.checkupPackage.findMany({
            where: { isPublished: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });

        return packages.map((item) => ({
            id: item.id,
            title: this.pickLocalizedText(locale, item.titleAz, item.titleEn, item.titleRu),
            subtitle: this.pickLocalizedOptionalText(
                locale,
                item.subtitleAz,
                item.subtitleEn,
                item.subtitleRu,
            ),
            price: item.price,
            currency: item.currency,
        }));
    }

    async findAllCheckupPackagesAdmin() {
        return this.prisma.checkupPackage.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }

    async createCheckupPackage(data: CreateCheckupPackageDto) {
        return this.prisma.checkupPackage.create({ data });
    }

    async updateCheckupPackage(id: string, data: UpdateCheckupPackageDto) {
        return this.prisma.checkupPackage.update({
            where: { id },
            data,
        });
    }

    async removeCheckupPackage(id: string) {
        return this.prisma.checkupPackage.delete({
            where: { id },
        });
    }

    private normalizeLocale(locale: string): 'az' | 'en' | 'ru' {
        if (locale === 'en' || locale === 'ru') {
            return locale;
        }
        return 'az';
    }

    private pickLocalizedText(
        locale: 'az' | 'en' | 'ru',
        az: string,
        en: string,
        ru: string,
    ): string {
        if (locale === 'en') return en;
        if (locale === 'ru') return ru;
        return az;
    }

    private pickLocalizedOptionalText(
        locale: 'az' | 'en' | 'ru',
        az: string | null,
        en: string | null,
        ru: string | null,
    ): string {
        if (locale === 'en') return en ?? az ?? '';
        if (locale === 'ru') return ru ?? az ?? '';
        return az ?? '';
    }
}
