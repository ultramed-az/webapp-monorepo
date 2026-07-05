import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactInfoDto, CreateContactMessageDto, UpdateContactInfoDto } from './dto/contact.dto';

type SupportedLocale = 'az' | 'en' | 'ru';

@Injectable()
export class ContactService {
    constructor(private readonly prisma: PrismaService) { }

    async getAdminContacts() {
        const contacts = await this.prisma.contactInfo.findMany({
            orderBy: [{ slug: 'asc' }],
        });

        return contacts.map((contact) => this.toAdminResponse(contact));
    }

    async getAdminMessages(limitRaw?: string) {
        const messages = await this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
            take: this.normalizeLimit(limitRaw),
        });

        return messages.map((message) => ({
            id: message.id,
            firstName: message.firstName,
            lastName: message.lastName,
            email: message.email,
            phone: message.phone,
            subject: message.subject,
            message: message.message,
            locale: message.locale,
            source: message.source,
            status: message.status,
            createdAt: message.createdAt.toISOString(),
            updatedAt: message.updatedAt.toISOString(),
        }));
    }

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

    async create(data: CreateContactInfoDto) {
        const contact = await this.prisma.contactInfo.create({ data });
        return this.toAdminResponse(contact);
    }

    async createMessage(data: CreateContactMessageDto) {
        const message = await this.prisma.contactMessage.create({ data });

        return {
            id: message.id,
            status: message.status,
            createdAt: message.createdAt.toISOString(),
        };
    }

    async update(slug: string, data: UpdateContactInfoDto) {
        const contact = await this.prisma.contactInfo.update({
            where: { slug },
            data,
        });
        return this.toAdminResponse(contact);
    }

    async remove(slug: string) {
        const contact = await this.prisma.contactInfo.delete({
            where: { slug },
        });
        return this.toAdminResponse(contact);
    }

    private toAdminResponse(contact: {
        id: string;
        slug: string;
        addressAz: string;
        addressEn: string;
        addressRu: string;
        mapLatitude: number;
        mapLongitude: number;
        mapEmbedUrl: string;
        phones: unknown;
        emails: unknown;
        workingHours: unknown;
        createdAt: Date;
        updatedAt: Date;
    }) {
        return {
            id: contact.id,
            slug: contact.slug,
            addressAz: contact.addressAz,
            addressEn: contact.addressEn,
            addressRu: contact.addressRu,
            mapLatitude: contact.mapLatitude,
            mapLongitude: contact.mapLongitude,
            mapEmbedUrl: contact.mapEmbedUrl,
            phones: this.normalizeAdminItems(contact.phones),
            emails: this.normalizeAdminItems(contact.emails),
            workingHours: this.normalizeAdminItems(contact.workingHours),
            createdAt: contact.createdAt.toISOString(),
            updatedAt: contact.updatedAt.toISOString(),
        };
    }

    private normalizeAdminItems(rawItems: unknown) {
        if (!Array.isArray(rawItems)) {
            return [];
        }

        return rawItems
            .map((item) => {
                if (!item || typeof item !== 'object') {
                    return null;
                }

                return {
                    labelAz: this.getStringField(item, 'labelAz'),
                    labelEn: this.getStringField(item, 'labelEn'),
                    labelRu: this.getStringField(item, 'labelRu'),
                    value: this.getStringField(item, 'value'),
                };
            })
            .filter((item): item is { labelAz: string; labelEn: string; labelRu: string; value: string } => item !== null);
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

    private normalizeLimit(limitRaw?: string): number {
        const parsed = Number.parseInt(limitRaw ?? '', 10);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            return 200;
        }
        return Math.min(parsed, 500);
    }
}
