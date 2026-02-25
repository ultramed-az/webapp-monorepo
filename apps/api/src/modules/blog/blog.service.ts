import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@ultramed/database';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto';

type MediaSummary = {
  id: string;
  cdnUrl: string;
  mimeType: string;
};

type BlogPostWithMedia = Prisma.BlogPostGetPayload<{
  include: { media: true };
}>;

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    const posts = await this.prisma.blogPost.findMany({
      include: { media: true },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return posts.map((post) => this.toAdminResponse(post));
  }

  async findOneAdmin(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!post) {
      return null;
    }

    return this.toAdminResponse(post);
  }

  async findAll(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);

    const posts = await this.prisma.blogPost.findMany({
      where: { published: true },
      include: { media: true },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return posts.map((post) => ({
      id: post.id,
      title: this.pickLocalizedField(post, 'title', locale),
      excerpt: this.pickLocalizedField(post, 'excerpt', locale),
      content: this.pickLocalizedField(post, 'content', locale),
      author: post.authorName ?? 'Ultramed',
      category: this.pickLocalizedField(post, 'category', locale),
      image: this.resolveImage(post.image, post.media),
      media: this.toMediaSummary(post.media),
      featured: post.featured,
      views: post.views,
      date: (post.publishedAt ?? post.createdAt).toISOString(),
    }));
  }

  async findOne(id: string, localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!post || !post.published) {
      return null;
    }

    return {
      id: post.id,
      title: this.pickLocalizedField(post, 'title', locale),
      excerpt: this.pickLocalizedField(post, 'excerpt', locale),
      content: this.pickLocalizedField(post, 'content', locale),
      author: post.authorName ?? 'Ultramed',
      category: this.pickLocalizedField(post, 'category', locale),
      image: this.resolveImage(post.image, post.media),
      media: this.toMediaSummary(post.media),
      featured: post.featured,
      views: post.views,
      date: (post.publishedAt ?? post.createdAt).toISOString(),
    };
  }

  async create(data: CreateBlogPostDto) {
    const { mediaId, ...rest } = data;
    const media = mediaId ? await this.requireMediaReference(mediaId) : null;

    const payload: Prisma.BlogPostCreateInput = {
      ...rest,
      image: this.resolveImage(rest.image, media),
      ...(media ? { media: { connect: { id: media.id } } } : {}),
    };

    const post = await this.prisma.blogPost.create({
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(post);
  }

  async update(id: string, data: UpdateBlogPostDto) {
    const { mediaId, ...rest } = data;
    const payload: Prisma.BlogPostUpdateInput = {
      ...rest,
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

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(post);
  }

  async remove(id: string) {
    return this.prisma.blogPost.delete({
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
    post: {
      titleAz: string;
      titleEn: string;
      titleRu: string;
      excerptAz: string | null;
      excerptEn: string | null;
      excerptRu: string | null;
      contentAz: string;
      contentEn: string;
      contentRu: string;
      categoryAz: string | null;
      categoryEn: string | null;
      categoryRu: string | null;
    },
    base: 'title' | 'excerpt' | 'content' | 'category',
    locale: 'az' | 'en' | 'ru',
  ): string {
    if (base === 'title') {
      if (locale === 'en') return post.titleEn;
      if (locale === 'ru') return post.titleRu;
      return post.titleAz;
    }

    if (base === 'excerpt') {
      const value =
        locale === 'en'
          ? post.excerptEn
          : locale === 'ru'
            ? post.excerptRu
            : post.excerptAz;
      return value ?? '';
    }

    if (base === 'content') {
      if (locale === 'en') return post.contentEn;
      if (locale === 'ru') return post.contentRu;
      return post.contentAz;
    }

    const value =
      locale === 'en'
        ? post.categoryEn
        : locale === 'ru'
          ? post.categoryRu
          : post.categoryAz;

    return value ?? '';
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

  private toAdminResponse(post: BlogPostWithMedia) {
    const { media, ...rest } = post;
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
