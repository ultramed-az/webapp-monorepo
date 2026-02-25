import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readBoolean,
  readIsoDateString,
  readNumber,
  readString,
  toOptionalBoolean,
  toOptionalNumber,
  toOptionalString,
  toNullableString,
} from '../../../common/validation/validation.util';

const BLOG_KEYS = [
  'titleAz',
  'titleEn',
  'titleRu',
  'contentAz',
  'contentEn',
  'contentRu',
  'excerptAz',
  'excerptEn',
  'excerptRu',
  'authorName',
  'categoryAz',
  'categoryEn',
  'categoryRu',
  'image',
  'mediaId',
  'published',
  'featured',
  'views',
  'publishedAt',
  'sortOrder',
] as const;

type NullableString = string | null;

export type CreateBlogPostDto = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  contentAz: string;
  contentEn: string;
  contentRu: string;
  excerptAz: NullableString;
  excerptEn: NullableString;
  excerptRu: NullableString;
  authorName: NullableString;
  categoryAz: NullableString;
  categoryEn: NullableString;
  categoryRu: NullableString;
  image: NullableString;
  mediaId: NullableString;
  published: boolean;
  featured: boolean;
  views: number;
  publishedAt: NullableString;
  sortOrder: number;
};

export type UpdateBlogPostDto = Partial<CreateBlogPostDto>;

export function parseCreateBlogPostDto(body: unknown): CreateBlogPostDto {
  const record = ensureObject(body, 'blog post payload');
  ensureNoUnknownKeys(record, BLOG_KEYS, 'blog post payload');

  const titleAz = readString(record, 'titleAz', {
    required: true,
    minLength: 1,
    maxLength: 255,
  })!;
  const contentAz = readString(record, 'contentAz', {
    required: true,
    minLength: 1,
    maxLength: 30000,
  })!;
  const published = readBoolean(record, 'published') ?? false;
  const publishedAt = readIsoDateString(record, 'publishedAt', {
    nullable: true,
  });

  return {
    titleAz,
    titleEn: readString(record, 'titleEn', { maxLength: 255 }) || titleAz,
    titleRu: readString(record, 'titleRu', { maxLength: 255 }) || titleAz,
    contentAz,
    contentEn:
      readString(record, 'contentEn', { maxLength: 30000 }) || contentAz,
    contentRu:
      readString(record, 'contentRu', { maxLength: 30000 }) || contentAz,
    excerptAz:
      toNullableString(
        readString(record, 'excerptAz', { nullable: true, maxLength: 5000 }),
      ) ?? null,
    excerptEn:
      toNullableString(
        readString(record, 'excerptEn', { nullable: true, maxLength: 5000 }),
      ) ?? null,
    excerptRu:
      toNullableString(
        readString(record, 'excerptRu', { nullable: true, maxLength: 5000 }),
      ) ?? null,
    authorName:
      toNullableString(
        readString(record, 'authorName', { nullable: true, maxLength: 150 }),
      ) ?? 'Ultramed',
    categoryAz:
      toNullableString(
        readString(record, 'categoryAz', { nullable: true, maxLength: 120 }),
      ) ?? null,
    categoryEn:
      toNullableString(
        readString(record, 'categoryEn', { nullable: true, maxLength: 120 }),
      ) ?? null,
    categoryRu:
      toNullableString(
        readString(record, 'categoryRu', { nullable: true, maxLength: 120 }),
      ) ?? null,
    image:
      toNullableString(
        readString(record, 'image', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    mediaId:
      toNullableString(
        readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
      ) ?? null,
    published,
    featured: readBoolean(record, 'featured') ?? false,
    views: readNumber(record, 'views', { integer: true, min: 0 }) ?? 0,
    publishedAt:
      publishedAt === undefined
        ? published
          ? new Date().toISOString()
          : null
        : publishedAt,
    sortOrder: readNumber(record, 'sortOrder', { integer: true }) ?? 0,
  };
}

export function parseUpdateBlogPostDto(body: unknown): UpdateBlogPostDto {
  const record = ensureObject(body, 'blog post payload');
  ensureNoUnknownKeys(record, BLOG_KEYS, 'blog post payload');
  ensureAtLeastOneField(record, BLOG_KEYS, 'blog post payload');

  return {
    titleAz: toOptionalString(
      readString(record, 'titleAz', { minLength: 1, maxLength: 255 }),
    ),
    titleEn: toOptionalString(
      readString(record, 'titleEn', { minLength: 1, maxLength: 255 }),
    ),
    titleRu: toOptionalString(
      readString(record, 'titleRu', { minLength: 1, maxLength: 255 }),
    ),
    contentAz: toOptionalString(
      readString(record, 'contentAz', { minLength: 1, maxLength: 30000 }),
    ),
    contentEn: toOptionalString(
      readString(record, 'contentEn', { minLength: 1, maxLength: 30000 }),
    ),
    contentRu: toOptionalString(
      readString(record, 'contentRu', { minLength: 1, maxLength: 30000 }),
    ),
    excerptAz: toNullableString(
      readString(record, 'excerptAz', { nullable: true, maxLength: 5000 }),
    ),
    excerptEn: toNullableString(
      readString(record, 'excerptEn', { nullable: true, maxLength: 5000 }),
    ),
    excerptRu: toNullableString(
      readString(record, 'excerptRu', { nullable: true, maxLength: 5000 }),
    ),
    authorName: toNullableString(
      readString(record, 'authorName', { nullable: true, maxLength: 150 }),
    ),
    categoryAz: toNullableString(
      readString(record, 'categoryAz', { nullable: true, maxLength: 120 }),
    ),
    categoryEn: toNullableString(
      readString(record, 'categoryEn', { nullable: true, maxLength: 120 }),
    ),
    categoryRu: toNullableString(
      readString(record, 'categoryRu', { nullable: true, maxLength: 120 }),
    ),
    image: toNullableString(
      readString(record, 'image', { nullable: true, maxLength: 2000 }),
    ),
    mediaId: toNullableString(
      readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
    ),
    published: toOptionalBoolean(readBoolean(record, 'published')),
    featured: toOptionalBoolean(readBoolean(record, 'featured')),
    views: toOptionalNumber(
      readNumber(record, 'views', { integer: true, min: 0 }),
    ),
    publishedAt: readIsoDateString(record, 'publishedAt', { nullable: true }),
    sortOrder: toOptionalNumber(
      readNumber(record, 'sortOrder', { integer: true }),
    ),
  };
}
