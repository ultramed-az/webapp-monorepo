import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@ultramed/database';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';

type SupportedLocale = 'az' | 'en' | 'ru';
type MediaSummary = {
  id: string;
  cdnUrl: string;
  mimeType: string;
};

type GalleryWithMedia = Prisma.GalleryGetPayload<{
  include: { media: true };
}>;

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    const items = await this.prisma.gallery.findMany({
      include: { media: true },
      orderBy: [{ createdAt: 'desc' }],
    });

    return items.map((item) => this.toAdminResponse(item));
  }

  async findOneAdmin(id: string) {
    const item = await this.prisma.gallery.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!item) {
      return null;
    }

    return this.toAdminResponse(item);
  }

  async findAll(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const items = await this.prisma.gallery.findMany({
      include: { media: true },
      orderBy: [{ createdAt: 'desc' }],
    });

    return items.map((item) => ({
      id: item.id,
      imageUrl: this.resolveImageUrl(item.imageUrl, item.media),
      caption: this.pickLocalizedCaption(item, locale),
      media: this.toMediaSummary(item.media),
    }));
  }

  async findOne(id: string, localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const item = await this.prisma.gallery.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      imageUrl: this.resolveImageUrl(item.imageUrl, item.media),
      caption: this.pickLocalizedCaption(item, locale),
      media: this.toMediaSummary(item.media),
    };
  }

  async create(data: CreateGalleryDto) {
    const { mediaId, imageUrl, ...rest } = data;
    const media = mediaId ? await this.requireMediaReference(mediaId) : null;

    const payload: Prisma.GalleryCreateInput = {
      ...rest,
      imageUrl: this.resolveRequiredImageUrl(imageUrl, media),
      ...(media ? { media: { connect: { id: media.id } } } : {}),
    };

    const item = await this.prisma.gallery.create({
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(item);
  }

  async update(id: string, data: UpdateGalleryDto) {
    const { mediaId, imageUrl, ...rest } = data;
    const normalizedImageUrl = imageUrl ?? undefined;
    const payload: Prisma.GalleryUpdateInput = {
      ...rest,
      ...(normalizedImageUrl !== undefined
        ? { imageUrl: normalizedImageUrl }
        : {}),
    };

    if (mediaId !== undefined) {
      if (mediaId === null) {
        payload.media = { disconnect: true };
      } else {
        const media = await this.requireMediaReference(mediaId);
        payload.media = { connect: { id: media.id } };
        if (normalizedImageUrl === undefined) {
          payload.imageUrl = media.cdnUrl;
        }
      }
    }

    const item = await this.prisma.gallery.update({
      where: { id },
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(item);
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

  private resolveImageUrl(
    imageUrl: string | null | undefined,
    media: { cdnUrl: string } | null | undefined,
  ): string {
    return media?.cdnUrl ?? imageUrl ?? '';
  }

  private resolveRequiredImageUrl(
    imageUrl: string | null | undefined,
    media: { cdnUrl: string } | null | undefined,
  ): string {
    const resolvedImageUrl = this.resolveImageUrl(imageUrl, media);
    if (resolvedImageUrl.length > 0) {
      return resolvedImageUrl;
    }

    throw new HttpException(
      {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed: "imageUrl" or "mediaId" is required',
        details: null,
      },
      HttpStatus.BAD_REQUEST,
    );
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

  private toAdminResponse(item: GalleryWithMedia) {
    const { media, ...rest } = item;
    return {
      ...rest,
      imageUrl: this.resolveImageUrl(rest.imageUrl, media),
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
