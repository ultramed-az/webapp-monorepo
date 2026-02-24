import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateContentPageDto,
  CreateTestimonialDto,
  UpdateContentPageDto,
  UpdateTestimonialDto,
} from './dto/content.dto';

type SupportedLocale = 'az' | 'en' | 'ru';
type SectionItem = { title: string; content: string };

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getTestimonialsAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async getPagesAdmin() {
    return (this.prisma as any).contentPage.findMany({
      orderBy: [{ slug: 'asc' }],
    });
  }

  async getPageBySlugAdmin(slug: string) {
    return (this.prisma as any).contentPage.findUnique({
      where: { slug },
    });
  }

  async getTestimonials(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const page = await (this.prisma as any).contentPage.findUnique({
      where: { slug: 'testimonials' },
    });

    if (!page) {
      throw new NotFoundException('Testimonials page content not found');
    }

    const testimonials = await this.prisma.testimonial.findMany({
      orderBy: [{ id: 'asc' }],
    });

    return {
      title: this.pickLocalizedPageField(page, 'title', locale),
      description: this.pickLocalizedPageField(page, 'description', locale),
      items: testimonials.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        role: this.pickLocalizedTestimonialField(testimonial, 'role', locale),
        quote: this.pickLocalizedTestimonialField(testimonial, 'comment', locale),
        rating: testimonial.rating,
      })),
    };
  }

  async getPrivacyPolicy(localeRaw: string) {
    return this.getSectionPage('privacy-policy', localeRaw);
  }

  async getTermsOfService(localeRaw: string) {
    return this.getSectionPage('terms-of-service', localeRaw);
  }

  async createTestimonial(data: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data });
  }

  async updateTestimonial(id: string, data: UpdateTestimonialDto) {
    return this.prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  async removeTestimonial(id: string) {
    return this.prisma.testimonial.delete({
      where: { id },
    });
  }

  async createPage(data: CreateContentPageDto) {
    return (this.prisma as any).contentPage.create({ data });
  }

  async updatePage(slug: string, data: UpdateContentPageDto) {
    return (this.prisma as any).contentPage.update({
      where: { slug },
      data,
    });
  }

  async removePage(slug: string) {
    return (this.prisma as any).contentPage.delete({
      where: { slug },
    });
  }

  private async getSectionPage(slug: 'privacy-policy' | 'terms-of-service', localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const page = await (this.prisma as any).contentPage.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException(`${slug} content not found`);
    }

    return {
      title: this.pickLocalizedPageField(page, 'title', locale),
      description: this.pickLocalizedPageField(page, 'description', locale),
      sections: this.pickLocalizedSections(page, locale),
    };
  }

  private normalizeLocale(locale: string): SupportedLocale {
    if (locale === 'en' || locale === 'ru') {
      return locale;
    }
    return 'az';
  }

  private pickLocalizedPageField(
    page: {
      titleAz: string;
      titleEn: string;
      titleRu: string;
      descriptionAz: string;
      descriptionEn: string;
      descriptionRu: string;
    },
    field: 'title' | 'description',
    locale: SupportedLocale,
  ): string {
    if (field === 'title') {
      if (locale === 'en') return page.titleEn;
      if (locale === 'ru') return page.titleRu;
      return page.titleAz;
    }

    if (locale === 'en') return page.descriptionEn;
    if (locale === 'ru') return page.descriptionRu;
    return page.descriptionAz;
  }

  private pickLocalizedTestimonialField(
    testimonial: {
      roleAz: string | null;
      roleEn: string | null;
      roleRu: string | null;
      commentAz: string;
      commentEn: string;
      commentRu: string;
    },
    field: 'role' | 'comment',
    locale: SupportedLocale,
  ): string {
    if (field === 'role') {
      if (locale === 'en') return testimonial.roleEn ?? testimonial.roleAz ?? '';
      if (locale === 'ru') return testimonial.roleRu ?? testimonial.roleAz ?? '';
      return testimonial.roleAz ?? '';
    }

    if (locale === 'en') return testimonial.commentEn;
    if (locale === 'ru') return testimonial.commentRu;
    return testimonial.commentAz;
  }

  private pickLocalizedSections(
    page: { sectionsAz: unknown; sectionsEn: unknown; sectionsRu: unknown },
    locale: SupportedLocale,
  ): SectionItem[] {
    const rawSections =
      locale === 'en'
        ? page.sectionsEn
        : locale === 'ru'
          ? page.sectionsRu
          : page.sectionsAz;

    if (!Array.isArray(rawSections)) {
      return [];
    }

    return rawSections
      .map((section) => {
        if (!section || typeof section !== 'object') {
          return null;
        }

        const title = this.getStringField(section, 'title');
        const content = this.getStringField(section, 'content');

        if (!title || !content) {
          return null;
        }

        return { title, content };
      })
      .filter((section): section is SectionItem => section !== null);
  }

  private getStringField(value: object, fieldName: string): string {
    if (!Object.prototype.hasOwnProperty.call(value, fieldName)) {
      return '';
    }

    const fieldValue = (value as Record<string, unknown>)[fieldName];
    return typeof fieldValue === 'string' ? fieldValue : '';
  }
}
