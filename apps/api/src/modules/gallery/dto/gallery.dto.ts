import { BadRequestException } from '@nestjs/common';
import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readString,
  toOptionalString,
  toNullableString,
} from '../../../common/validation/validation.util';

const GALLERY_KEYS = [
  'imageUrl',
  'mediaId',
  'captionAz',
  'captionEn',
  'captionRu',
] as const;

export type CreateGalleryDto = {
  imageUrl: string | null;
  mediaId: string | null;
  captionAz: string | null;
  captionEn: string | null;
  captionRu: string | null;
};

export type UpdateGalleryDto = Partial<CreateGalleryDto>;

export function parseCreateGalleryDto(body: unknown): CreateGalleryDto {
  const record = ensureObject(body, 'gallery payload');
  ensureNoUnknownKeys(record, GALLERY_KEYS, 'gallery payload');

  const imageUrl =
    toNullableString(
      readString(record, 'imageUrl', { nullable: true, maxLength: 2000 }),
    ) ?? null;
  const mediaId =
    toNullableString(
      readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
    ) ?? null;

  if (!imageUrl && !mediaId) {
    throw new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed: "imageUrl" or "mediaId" is required',
      details: null,
    });
  }

  const captionAz =
    toNullableString(
      readString(record, 'captionAz', { nullable: true, maxLength: 2000 }),
    ) ?? null;

  return {
    imageUrl,
    mediaId,
    captionAz,
    captionEn:
      toNullableString(
        readString(record, 'captionEn', { nullable: true, maxLength: 2000 }),
      ) ?? captionAz,
    captionRu:
      toNullableString(
        readString(record, 'captionRu', { nullable: true, maxLength: 2000 }),
      ) ?? captionAz,
  };
}

export function parseUpdateGalleryDto(body: unknown): UpdateGalleryDto {
  const record = ensureObject(body, 'gallery payload');
  ensureNoUnknownKeys(record, GALLERY_KEYS, 'gallery payload');
  ensureAtLeastOneField(record, GALLERY_KEYS, 'gallery payload');

  return {
    imageUrl: toOptionalString(
      readString(record, 'imageUrl', { minLength: 1, maxLength: 2000 }),
    ),
    mediaId: toNullableString(
      readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
    ),
    captionAz: toNullableString(
      readString(record, 'captionAz', { nullable: true, maxLength: 2000 }),
    ),
    captionEn: toNullableString(
      readString(record, 'captionEn', { nullable: true, maxLength: 2000 }),
    ),
    captionRu: toNullableString(
      readString(record, 'captionRu', { nullable: true, maxLength: 2000 }),
    ),
  };
}
