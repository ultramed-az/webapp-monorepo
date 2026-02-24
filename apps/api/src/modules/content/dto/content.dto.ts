import {
  UnknownRecord,
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readNumber,
  readObjectArray,
  readString,
  toOptionalNumber,
  toOptionalObjectArray,
  toOptionalString,
  toNullableString,
} from '../../../common/validation/validation.util';

const TESTIMONIAL_KEYS = [
  'name',
  'roleAz',
  'roleEn',
  'roleRu',
  'commentAz',
  'commentEn',
  'commentRu',
  'rating',
] as const;

const PAGE_CREATE_KEYS = [
  'slug',
  'titleAz',
  'titleEn',
  'titleRu',
  'descriptionAz',
  'descriptionEn',
  'descriptionRu',
  'sectionsAz',
  'sectionsEn',
  'sectionsRu',
] as const;

const PAGE_UPDATE_KEYS = [
  'titleAz',
  'titleEn',
  'titleRu',
  'descriptionAz',
  'descriptionEn',
  'descriptionRu',
  'sectionsAz',
  'sectionsEn',
  'sectionsRu',
] as const;

type NullableString = string | null;

export type ContentSectionDto = {
  title: string;
  content: string;
};

export type CreateTestimonialDto = {
  name: string;
  roleAz: NullableString;
  roleEn: NullableString;
  roleRu: NullableString;
  commentAz: string;
  commentEn: string;
  commentRu: string;
  rating: number;
};

export type UpdateTestimonialDto = Partial<CreateTestimonialDto>;

export type CreateContentPageDto = {
  slug: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz: string;
  descriptionEn: string;
  descriptionRu: string;
  sectionsAz: ContentSectionDto[] | null;
  sectionsEn: ContentSectionDto[] | null;
  sectionsRu: ContentSectionDto[] | null;
};

export type UpdateContentPageDto = Partial<Omit<CreateContentPageDto, 'slug'>>;

function parseSections(
  record: Record<string, unknown>,
  key: 'sectionsAz' | 'sectionsEn' | 'sectionsRu',
): ContentSectionDto[] | null | undefined {
  const sections = readObjectArray(record, key, { nullable: true, maxItems: 100 });
  if (sections === undefined || sections === null) {
    return sections;
  }

  return sections.map((section, index) => parseSection(section, `${key}[${index}]`));
}

function parseSection(section: UnknownRecord, context: string): ContentSectionDto {
  ensureNoUnknownKeys(section, ['title', 'content'], context);
  return {
    title: readString(section, 'title', { required: true, minLength: 1, maxLength: 1000 })!,
    content: readString(section, 'content', { required: true, minLength: 1, maxLength: 30000 })!,
  };
}

export function parseCreateTestimonialDto(body: unknown): CreateTestimonialDto {
  const record = ensureObject(body, 'testimonial payload');
  ensureNoUnknownKeys(record, TESTIMONIAL_KEYS, 'testimonial payload');

  const commentAz = readString(record, 'commentAz', { required: true, minLength: 1, maxLength: 20000 })!;

  return {
    name: readString(record, 'name', { required: true, minLength: 1, maxLength: 200 })!,
    roleAz: toNullableString(readString(record, 'roleAz', { nullable: true, maxLength: 255 })) ?? null,
    roleEn: toNullableString(readString(record, 'roleEn', { nullable: true, maxLength: 255 })) ?? null,
    roleRu: toNullableString(readString(record, 'roleRu', { nullable: true, maxLength: 255 })) ?? null,
    commentAz,
    commentEn: readString(record, 'commentEn', { maxLength: 20000 }) || commentAz,
    commentRu: readString(record, 'commentRu', { maxLength: 20000 }) || commentAz,
    rating: readNumber(record, 'rating', { integer: true, min: 1, max: 5 }) ?? 5,
  };
}

export function parseUpdateTestimonialDto(body: unknown): UpdateTestimonialDto {
  const record = ensureObject(body, 'testimonial payload');
  ensureNoUnknownKeys(record, TESTIMONIAL_KEYS, 'testimonial payload');
  ensureAtLeastOneField(record, TESTIMONIAL_KEYS, 'testimonial payload');

  return {
    name: toOptionalString(readString(record, 'name', { minLength: 1, maxLength: 200 })),
    roleAz: toNullableString(readString(record, 'roleAz', { nullable: true, maxLength: 255 })),
    roleEn: toNullableString(readString(record, 'roleEn', { nullable: true, maxLength: 255 })),
    roleRu: toNullableString(readString(record, 'roleRu', { nullable: true, maxLength: 255 })),
    commentAz: toOptionalString(readString(record, 'commentAz', { minLength: 1, maxLength: 20000 })),
    commentEn: toOptionalString(readString(record, 'commentEn', { minLength: 1, maxLength: 20000 })),
    commentRu: toOptionalString(readString(record, 'commentRu', { minLength: 1, maxLength: 20000 })),
    rating: toOptionalNumber(readNumber(record, 'rating', { integer: true, min: 1, max: 5 })),
  };
}

export function parseCreateContentPageDto(body: unknown): CreateContentPageDto {
  const record = ensureObject(body, 'content page payload');
  ensureNoUnknownKeys(record, PAGE_CREATE_KEYS, 'content page payload');

  const titleAz = readString(record, 'titleAz', { required: true, minLength: 1, maxLength: 255 })!;
  const descriptionAz = readString(record, 'descriptionAz', {
    required: true,
    minLength: 1,
    maxLength: 30000,
  })!;

  return {
    slug: readString(record, 'slug', { required: true, minLength: 2, maxLength: 120 })!,
    titleAz,
    titleEn: readString(record, 'titleEn', { maxLength: 255 }) || titleAz,
    titleRu: readString(record, 'titleRu', { maxLength: 255 }) || titleAz,
    descriptionAz,
    descriptionEn: readString(record, 'descriptionEn', { maxLength: 30000 }) || descriptionAz,
    descriptionRu: readString(record, 'descriptionRu', { maxLength: 30000 }) || descriptionAz,
    sectionsAz: parseSections(record, 'sectionsAz') ?? null,
    sectionsEn: parseSections(record, 'sectionsEn') ?? null,
    sectionsRu: parseSections(record, 'sectionsRu') ?? null,
  };
}

export function parseUpdateContentPageDto(body: unknown): UpdateContentPageDto {
  const record = ensureObject(body, 'content page payload');
  ensureNoUnknownKeys(record, PAGE_UPDATE_KEYS, 'content page payload');
  ensureAtLeastOneField(record, PAGE_UPDATE_KEYS, 'content page payload');

  return {
    titleAz: toOptionalString(readString(record, 'titleAz', { minLength: 1, maxLength: 255 })),
    titleEn: toOptionalString(readString(record, 'titleEn', { minLength: 1, maxLength: 255 })),
    titleRu: toOptionalString(readString(record, 'titleRu', { minLength: 1, maxLength: 255 })),
    descriptionAz: toOptionalString(readString(record, 'descriptionAz', { minLength: 1, maxLength: 30000 })),
    descriptionEn: toOptionalString(readString(record, 'descriptionEn', { minLength: 1, maxLength: 30000 })),
    descriptionRu: toOptionalString(readString(record, 'descriptionRu', { minLength: 1, maxLength: 30000 })),
    sectionsAz: toOptionalObjectArray(parseSections(record, 'sectionsAz')),
    sectionsEn: toOptionalObjectArray(parseSections(record, 'sectionsEn')),
    sectionsRu: toOptionalObjectArray(parseSections(record, 'sectionsRu')),
  };
}
