import { BadRequestException } from '@nestjs/common';
import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readBoolean,
  readNumber,
  readString,
  toNullableString,
  toOptionalBoolean,
  toOptionalNumber,
  toOptionalString,
} from '../../../common/validation/validation.util';

const HOME_STAT_CREATE_KEYS = ['id', 'value', 'sortOrder'] as const;
const HOME_STAT_UPDATE_KEYS = ['value', 'sortOrder'] as const;
const ANNOUNCEMENT_KEYS = ['textAz', 'textEn', 'textRu', 'href', 'sortOrder', 'isPublished'] as const;
const CHECKUP_PACKAGE_KEYS = [
  'titleAz',
  'titleEn',
  'titleRu',
  'subtitleAz',
  'subtitleEn',
  'subtitleRu',
  'price',
  'currency',
  'sortOrder',
  'isPublished',
] as const;

const HOME_STAT_ID_REGEX = /^[a-zA-Z0-9_-]{2,64}$/;

export type CreateHomeStatDto = {
  id: string;
  value: string;
  sortOrder: number;
};

export type UpdateHomeStatDto = Partial<Omit<CreateHomeStatDto, 'id'>>;

export type CreateAnnouncementDto = {
  textAz: string;
  textEn: string;
  textRu: string;
  href: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type UpdateAnnouncementDto = Partial<CreateAnnouncementDto>;

export type CreateCheckupPackageDto = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  subtitleAz: string | null;
  subtitleEn: string | null;
  subtitleRu: string | null;
  price: string;
  currency: string;
  sortOrder: number;
  isPublished: boolean;
};

export type UpdateCheckupPackageDto = Partial<CreateCheckupPackageDto>;

export function parseCreateHomeStatDto(body: unknown): CreateHomeStatDto {
  const record = ensureObject(body, 'home stat payload');
  ensureNoUnknownKeys(record, HOME_STAT_CREATE_KEYS, 'home stat payload');

  const id = readString(record, 'id', { required: true, minLength: 2, maxLength: 64 })!;
  validateHomeStatId(id);

  return {
    id,
    value: readString(record, 'value', { required: true, minLength: 1, maxLength: 120 })!,
    sortOrder: readNumber(record, 'sortOrder', { integer: true }) ?? 0,
  };
}

export function parseUpdateHomeStatDto(body: unknown): UpdateHomeStatDto {
  const record = ensureObject(body, 'home stat payload');
  ensureNoUnknownKeys(record, HOME_STAT_UPDATE_KEYS, 'home stat payload');
  ensureAtLeastOneField(record, HOME_STAT_UPDATE_KEYS, 'home stat payload');

  return {
    value: toOptionalString(readString(record, 'value', { minLength: 1, maxLength: 120 })),
    sortOrder: toOptionalNumber(readNumber(record, 'sortOrder', { integer: true })),
  };
}

function validateHomeStatId(value: string): void {
  if (!HOME_STAT_ID_REGEX.test(value)) {
    throw new BadRequestException(
      'Validation failed: "id" must contain only letters, numbers, "_" or "-"',
    );
  }
}

export function parseCreateAnnouncementDto(body: unknown): CreateAnnouncementDto {
  const record = ensureObject(body, 'announcement payload');
  ensureNoUnknownKeys(record, ANNOUNCEMENT_KEYS, 'announcement payload');

  const textAz = readString(record, 'textAz', {
    required: true,
    minLength: 1,
    maxLength: 1000,
  })!;

  return {
    textAz,
    textEn: readString(record, 'textEn', { maxLength: 1000 }) || textAz,
    textRu: readString(record, 'textRu', { maxLength: 1000 }) || textAz,
    href:
      toNullableString(
        readString(record, 'href', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    sortOrder: readNumber(record, 'sortOrder', { integer: true }) ?? 0,
    isPublished: readBoolean(record, 'isPublished') ?? true,
  };
}

export function parseUpdateAnnouncementDto(body: unknown): UpdateAnnouncementDto {
  const record = ensureObject(body, 'announcement payload');
  ensureNoUnknownKeys(record, ANNOUNCEMENT_KEYS, 'announcement payload');
  ensureAtLeastOneField(record, ANNOUNCEMENT_KEYS, 'announcement payload');

  return {
    textAz: toOptionalString(
      readString(record, 'textAz', { minLength: 1, maxLength: 1000 }),
    ),
    textEn: toOptionalString(
      readString(record, 'textEn', { minLength: 1, maxLength: 1000 }),
    ),
    textRu: toOptionalString(
      readString(record, 'textRu', { minLength: 1, maxLength: 1000 }),
    ),
    href: toNullableString(
      readString(record, 'href', { nullable: true, maxLength: 2000 }),
    ),
    sortOrder: toOptionalNumber(readNumber(record, 'sortOrder', { integer: true })),
    isPublished: toOptionalBoolean(readBoolean(record, 'isPublished')),
  };
}

export function parseCreateCheckupPackageDto(body: unknown): CreateCheckupPackageDto {
  const record = ensureObject(body, 'check-up package payload');
  ensureNoUnknownKeys(record, CHECKUP_PACKAGE_KEYS, 'check-up package payload');

  const titleAz = readString(record, 'titleAz', {
    required: true,
    minLength: 1,
    maxLength: 255,
  })!;

  return {
    titleAz,
    titleEn: readString(record, 'titleEn', { maxLength: 255 }) || titleAz,
    titleRu: readString(record, 'titleRu', { maxLength: 255 }) || titleAz,
    subtitleAz:
      toNullableString(
        readString(record, 'subtitleAz', { nullable: true, maxLength: 255 }),
      ) ?? null,
    subtitleEn:
      toNullableString(
        readString(record, 'subtitleEn', { nullable: true, maxLength: 255 }),
      ) ?? null,
    subtitleRu:
      toNullableString(
        readString(record, 'subtitleRu', { nullable: true, maxLength: 255 }),
      ) ?? null,
    price: readString(record, 'price', {
      required: true,
      minLength: 1,
      maxLength: 64,
    })!,
    currency: readString(record, 'currency', { maxLength: 16 }) || '₼',
    sortOrder: readNumber(record, 'sortOrder', { integer: true }) ?? 0,
    isPublished: readBoolean(record, 'isPublished') ?? true,
  };
}

export function parseUpdateCheckupPackageDto(body: unknown): UpdateCheckupPackageDto {
  const record = ensureObject(body, 'check-up package payload');
  ensureNoUnknownKeys(record, CHECKUP_PACKAGE_KEYS, 'check-up package payload');
  ensureAtLeastOneField(record, CHECKUP_PACKAGE_KEYS, 'check-up package payload');

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
    subtitleAz: toNullableString(
      readString(record, 'subtitleAz', { nullable: true, maxLength: 255 }),
    ),
    subtitleEn: toNullableString(
      readString(record, 'subtitleEn', { nullable: true, maxLength: 255 }),
    ),
    subtitleRu: toNullableString(
      readString(record, 'subtitleRu', { nullable: true, maxLength: 255 }),
    ),
    price: toOptionalString(
      readString(record, 'price', { minLength: 1, maxLength: 64 }),
    ),
    currency: toOptionalString(readString(record, 'currency', { minLength: 1, maxLength: 16 })),
    sortOrder: toOptionalNumber(readNumber(record, 'sortOrder', { integer: true })),
    isPublished: toOptionalBoolean(readBoolean(record, 'isPublished')),
  };
}
