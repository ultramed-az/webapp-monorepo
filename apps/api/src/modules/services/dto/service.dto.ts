import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readBoolean,
  readNumber,
  readString,
  readStringArray,
  toOptionalBoolean,
  toOptionalNumber,
  toOptionalString,
  toOptionalStringArray,
  toNullableString,
} from '../../../common/validation/validation.util';

const SERVICE_KEYS = [
  'titleAz',
  'titleEn',
  'titleRu',
  'summaryAz',
  'summaryEn',
  'summaryRu',
  'contentAz',
  'contentEn',
  'contentRu',
  'highlightsAz',
  'highlightsEn',
  'highlightsRu',
  'iconKey',
  'image',
  'mediaId',
  'sortOrder',
  'isPublished',
] as const;

export type CreateServiceDto = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  summaryAz: string;
  summaryEn: string;
  summaryRu: string;
  contentAz: string;
  contentEn: string;
  contentRu: string;
  highlightsAz: string[] | null;
  highlightsEn: string[] | null;
  highlightsRu: string[] | null;
  iconKey: string | null;
  image: string | null;
  mediaId: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type UpdateServiceDto = Partial<CreateServiceDto>;

export function parseCreateServiceDto(body: unknown): CreateServiceDto {
  const record = ensureObject(body, 'service payload');
  ensureNoUnknownKeys(record, SERVICE_KEYS, 'service payload');

  const titleAz = readString(record, 'titleAz', {
    required: true,
    minLength: 1,
    maxLength: 255,
  })!;
  const summaryAz = readString(record, 'summaryAz', {
    required: true,
    minLength: 1,
    maxLength: 5000,
  })!;
  const contentAz = readString(record, 'contentAz', {
    required: true,
    minLength: 1,
    maxLength: 20000,
  })!;

  return {
    titleAz,
    titleEn: readString(record, 'titleEn', { maxLength: 255 }) || titleAz,
    titleRu: readString(record, 'titleRu', { maxLength: 255 }) || titleAz,
    summaryAz,
    summaryEn:
      readString(record, 'summaryEn', { maxLength: 5000 }) || summaryAz,
    summaryRu:
      readString(record, 'summaryRu', { maxLength: 5000 }) || summaryAz,
    contentAz,
    contentEn:
      readString(record, 'contentEn', { maxLength: 20000 }) || contentAz,
    contentRu:
      readString(record, 'contentRu', { maxLength: 20000 }) || contentAz,
    highlightsAz:
      readStringArray(record, 'highlightsAz', {
        nullable: true,
        maxItems: 50,
        itemMaxLength: 300,
      }) ?? null,
    highlightsEn:
      readStringArray(record, 'highlightsEn', {
        nullable: true,
        maxItems: 50,
        itemMaxLength: 300,
      }) ?? null,
    highlightsRu:
      readStringArray(record, 'highlightsRu', {
        nullable: true,
        maxItems: 50,
        itemMaxLength: 300,
      }) ?? null,
    iconKey:
      toNullableString(
        readString(record, 'iconKey', { nullable: true, maxLength: 150 }),
      ) ?? null,
    image:
      toNullableString(
        readString(record, 'image', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    mediaId:
      toNullableString(
        readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
      ) ?? null,
    sortOrder: readNumber(record, 'sortOrder', { integer: true }) ?? 0,
    isPublished: readBoolean(record, 'isPublished') ?? true,
  };
}

export function parseUpdateServiceDto(body: unknown): UpdateServiceDto {
  const record = ensureObject(body, 'service payload');
  ensureNoUnknownKeys(record, SERVICE_KEYS, 'service payload');
  ensureAtLeastOneField(record, SERVICE_KEYS, 'service payload');

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
    summaryAz: toOptionalString(
      readString(record, 'summaryAz', { minLength: 1, maxLength: 5000 }),
    ),
    summaryEn: toOptionalString(
      readString(record, 'summaryEn', { minLength: 1, maxLength: 5000 }),
    ),
    summaryRu: toOptionalString(
      readString(record, 'summaryRu', { minLength: 1, maxLength: 5000 }),
    ),
    contentAz: toOptionalString(
      readString(record, 'contentAz', { minLength: 1, maxLength: 20000 }),
    ),
    contentEn: toOptionalString(
      readString(record, 'contentEn', { minLength: 1, maxLength: 20000 }),
    ),
    contentRu: toOptionalString(
      readString(record, 'contentRu', { minLength: 1, maxLength: 20000 }),
    ),
    highlightsAz: toOptionalStringArray(
      readStringArray(record, 'highlightsAz', {
        nullable: true,
        maxItems: 50,
        itemMaxLength: 300,
      }),
    ),
    highlightsEn: toOptionalStringArray(
      readStringArray(record, 'highlightsEn', {
        nullable: true,
        maxItems: 50,
        itemMaxLength: 300,
      }),
    ),
    highlightsRu: toOptionalStringArray(
      readStringArray(record, 'highlightsRu', {
        nullable: true,
        maxItems: 50,
        itemMaxLength: 300,
      }),
    ),
    iconKey: toNullableString(
      readString(record, 'iconKey', { nullable: true, maxLength: 150 }),
    ),
    image: toNullableString(
      readString(record, 'image', { nullable: true, maxLength: 2000 }),
    ),
    mediaId: toNullableString(
      readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
    ),
    sortOrder: toOptionalNumber(
      readNumber(record, 'sortOrder', { integer: true }),
    ),
    isPublished: toOptionalBoolean(readBoolean(record, 'isPublished')),
  };
}
