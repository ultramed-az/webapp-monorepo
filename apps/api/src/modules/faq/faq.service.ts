import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type SupportedLocale = 'az' | 'en' | 'ru';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    return this.prisma.faq.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async findOneAdmin(id: string) {
    return this.prisma.faq.findUnique({
      where: { id },
    });
  }

  async findAll(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const faqs = await this.prisma.faq.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    return faqs.map((item) => ({
      id: item.id,
      question: this.pickLocalizedField(item, 'question', locale),
      answer: this.pickLocalizedField(item, 'answer', locale),
    }));
  }

  async findOne(id: string, localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);
    const item = await this.prisma.faq.findUnique({
      where: { id },
    });

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      question: this.pickLocalizedField(item, 'question', locale),
      answer: this.pickLocalizedField(item, 'answer', locale),
    };
  }

  async create(data: any) {
    return this.prisma.faq.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.faq.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.faq.delete({
      where: { id },
    });
  }

  private normalizeLocale(locale: string): SupportedLocale {
    if (locale === 'en' || locale === 'ru') {
      return locale;
    }
    return 'az';
  }

  private pickLocalizedField(
    item: {
      questionAz: string;
      questionEn: string;
      questionRu: string;
      answerAz: string;
      answerEn: string;
      answerRu: string;
    },
    field: 'question' | 'answer',
    locale: SupportedLocale,
  ): string {
    if (field === 'question') {
      if (locale === 'en') return item.questionEn;
      if (locale === 'ru') return item.questionRu;
      return item.questionAz;
    }

    if (locale === 'en') return item.answerEn;
    if (locale === 'ru') return item.answerRu;
    return item.answerAz;
  }
}
