import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@ultramed/database';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

type MediaSummary = {
  id: string;
  cdnUrl: string;
  mimeType: string;
};

type ServiceWithMedia = Prisma.ServiceGetPayload<{
  include: { media: true };
}>;

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAllAdmin() {
    const services = await this.prisma.service.findMany({
      include: { media: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return services.map((service) => this.toAdminResponse(service));
  }

  async findOneAdmin(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!service) {
      return null;
    }

    return this.toAdminResponse(service);
  }

  async findAll(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const services = await this.prisma.service.findMany({
      where: { isPublished: true },
      include: { media: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return services.map((service) => ({
      id: service.id,
      title: this.pickLocalizedField(service, 'title', locale),
      summary: this.pickLocalizedField(service, 'summary', locale),
      iconKey: service.iconKey,
      image: this.resolveImage(service.image, service.media),
      media: this.toMediaSummary(service.media),
    }));
  }

  async findOne(id: string, localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { media: true },
    });
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
      image: this.resolveImage(service.image, service.media),
      media: this.toMediaSummary(service.media),
    };
  }

  async create(data: CreateServiceDto) {
    const { highlightsAz, highlightsEn, highlightsRu, mediaId, ...rest } = data;
    const media = mediaId ? await this.requireMediaReference(mediaId) : null;

    const payload: Prisma.ServiceCreateInput = {
      ...rest,
      image: this.resolveImage(rest.image, media),
      highlightsAz: this.toNullableJsonArray(highlightsAz),
      highlightsEn: this.toNullableJsonArray(highlightsEn),
      highlightsRu: this.toNullableJsonArray(highlightsRu),
      ...(media ? { media: { connect: { id: media.id } } } : {}),
    };

    const service = await this.prisma.service.create({
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(service);
  }

  async update(id: string, data: UpdateServiceDto) {
    const { highlightsAz, highlightsEn, highlightsRu, mediaId, ...rest } = data;

    const payload: Prisma.ServiceUpdateInput = {
      ...rest,
      highlightsAz: this.toNullableJsonArray(highlightsAz),
      highlightsEn: this.toNullableJsonArray(highlightsEn),
      highlightsRu: this.toNullableJsonArray(highlightsRu),
    };

    if (mediaId !== undefined) {
      if (mediaId === null) {
        payload.media = { disconnect: true };
        if (rest.image === undefined) {
          payload.image = null;
        }
      } else {
        const media = await this.requireMediaReference(mediaId);
        payload.media = { connect: { id: media.id } };
        if (rest.image === undefined) {
          payload.image = media.cdnUrl;
        }
      }
    }

    const service = await this.prisma.service.update({
      where: { id },
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(service);
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

  private toNullableJsonArray(
    value: string[] | null | undefined,
  ): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return Prisma.JsonNull;
    }

    return value as Prisma.InputJsonValue;
  }

  private resolveImage(
    image: string | null | undefined,
    media: { cdnUrl: string } | null | undefined,
  ): string | null {
    return media?.cdnUrl ?? image ?? null;
  }

  private toMediaSummary(
    media: { id: string; cdnUrl: string; mimeType: string } | null | undefined,
  ): MediaSummary | null {
    if (!media) {
      return null;
    }

    return {
      id: media.id,
      cdnUrl: media.cdnUrl,
      mimeType: media.mimeType,
    };
  }

  private toAdminResponse(service: ServiceWithMedia) {
    const { media, ...rest } = service;
    return {
      ...rest,
      image: this.resolveImage(rest.image, media),
      media: this.toMediaSummary(media),
    };
  }

  private async requireMediaReference(mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new HttpException(
        {
          code: 'MEDIA_REFERENCE_INVALID',
          message: 'Media reference is invalid',
          details: { mediaId },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return media;
  }
}
