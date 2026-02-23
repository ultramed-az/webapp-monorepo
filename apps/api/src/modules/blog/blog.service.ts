import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllAdmin() {
        return this.prisma.blogPost.findMany({
            orderBy: [
                { featured: 'desc' },
                { sortOrder: 'asc' },
                { publishedAt: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }

    async findOneAdmin(id: string) {
        return this.prisma.blogPost.findUnique({
            where: { id },
        });
    }

    async findAll(localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);

        const posts = await this.prisma.blogPost.findMany({
            where: { published: true },
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
            image: post.image,
            featured: post.featured,
            views: post.views,
            date: (post.publishedAt ?? post.createdAt).toISOString(),
        }));
    }

    async findOne(id: string, localeRaw: string) {
        const locale = this.normalizeLocale(localeRaw);
        const post = await this.prisma.blogPost.findUnique({
            where: { id },
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
            image: post.image,
            featured: post.featured,
            views: post.views,
            date: (post.publishedAt ?? post.createdAt).toISOString(),
        };
    }

    async create(data: any) {
        return this.prisma.blogPost.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.blogPost.update({
            where: { id },
            data,
        });
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
}
