import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type SupportedLocale = 'az' | 'en' | 'ru';

@Injectable()
export class ContactService {
    constructor(private readonly prisma: PrismaService) { }

    async getContact(localeRaw: string, slug = 'main') {
        const locale = this.normalizeLocale(localeRaw);
        const contact = await this.prisma.contactInfo.findUnique({
            where: { slug },
        });

        if (!contact) {
            throw new NotFoundException('Contact info not found');
        }

        return {
            address: this.pickLocalizedText({
                az: contact.addressAz,
                en: contact.addressEn,
                ru: contact.addressRu,
            }, locale),
            map: {
                latitude: contact.mapLatitude,
                longitude: contact.mapLongitude,
                embedUrl: contact.mapEmbedUrl,
            },
            phones: this.mapLocalizedItems(contact.phones, locale),
            emails: this.mapLocalizedItems(contact.emails, locale),
            workingHours: this.mapLocalizedItems(contact.workingHours, locale),
        };
    }

    async create(data: any) {
        return this.prisma.contactInfo.create({ data });
    }

    async update(slug: string, data: any) {
        return this.prisma.contactInfo.update({
            where: { slug },
            data,
        });
    }

    async remove(slug: string) {
        return this.prisma.contactInfo.delete({
            where: { slug },
        });
    }

    private normalizeLocale(locale: string): SupportedLocale {
        if (locale === 'en' || locale === 'ru') {
            return locale;
        }
        return 'az';
    }

    private pickLocalizedText(
        value: { az: string; en: string; ru: string },
        locale: SupportedLocale,
    ): string {
        if (locale === 'en') return value.en;
        if (locale === 'ru') return value.ru;
        return value.az;
    }

    private mapLocalizedItems(
        rawItems: unknown,
        locale: SupportedLocale,
    ): Array<{ label: string; value: string }> {
        if (!Array.isArray(rawItems)) {
            return [];
        }

        return rawItems
            .map((item) => {
                if (!item || typeof item !== 'object') {
                    return null;
                }

                const labelAz = this.getStringField(item, 'labelAz');
                const labelEn = this.getStringField(item, 'labelEn');
                const labelRu = this.getStringField(item, 'labelRu');
                const value = this.getStringField(item, 'value');

                if (!value) {
                    return null;
                }

                const label =
                    locale === 'en'
                        ? labelEn || labelAz || ''
                        : locale === 'ru'
                            ? labelRu || labelAz || ''
                            : labelAz || '';

                return { label, value };
            })
            .filter((item): item is { label: string; value: string } => item !== null);
    }

    private getStringField(value: object, fieldName: string): string {
        if (!Object.prototype.hasOwnProperty.call(value, fieldName)) {
            return '';
        }

        const fieldValue = (value as Record<string, unknown>)[fieldName];
        return typeof fieldValue === 'string' ? fieldValue : '';
    }
}
