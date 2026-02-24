import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';

type SupportedLocale = 'az' | 'en' | 'ru';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    return this.prisma.gallery.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async findOneAdmin(id: string) {
    return this.prisma.gallery.findUnique({
      where: { id },
    });
  }

  async findAll(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const items = await this.prisma.gallery.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    return items.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      caption: this.pickLocalizedCaption(item, locale),
    }));
  }

  async findOne(id: string, localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const item = await this.prisma.gallery.findUnique({
      where: { id },
    });

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      imageUrl: item.imageUrl,
      caption: this.pickLocalizedCaption(item, locale),
    };
  }

  async create(data: CreateGalleryDto) {
    return this.prisma.gallery.create({ data });
  }

  async update(id: string, data: UpdateGalleryDto) {
    return this.prisma.gallery.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.gallery.delete({
      where: { id },
    });
  }

  private normalizeLocale(locale: string): SupportedLocale {
    if (locale === 'en' || locale === 'ru') {
      return locale;
    }
    return 'az';
  }

  private pickLocalizedCaption(
    item: {
      captionAz: string | null;
      captionEn: string | null;
      captionRu: string | null;
    },
    locale: SupportedLocale,
  ): string {
    if (locale === 'en') return item.captionEn ?? item.captionAz ?? '';
    if (locale === 'ru') return item.captionRu ?? item.captionAz ?? '';
    return item.captionAz ?? '';
  }
}
