import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readString,
  toOptionalString,
  toNullableString,
} from '../../../common/validation/validation.util';

const GALLERY_KEYS = ['imageUrl', 'captionAz', 'captionEn', 'captionRu'] as const;

export type CreateGalleryDto = {
  imageUrl: string;
  captionAz: string | null;
  captionEn: string | null;
  captionRu: string | null;
};

export type UpdateGalleryDto = Partial<CreateGalleryDto>;

export function parseCreateGalleryDto(body: unknown): CreateGalleryDto {
  const record = ensureObject(body, 'gallery payload');
  ensureNoUnknownKeys(record, GALLERY_KEYS, 'gallery payload');

  const captionAz = toNullableString(readString(record, 'captionAz', { nullable: true, maxLength: 2000 })) ?? null;

  return {
    imageUrl: readString(record, 'imageUrl', { required: true, minLength: 1, maxLength: 2000 })!,
    captionAz,
    captionEn: toNullableString(readString(record, 'captionEn', { nullable: true, maxLength: 2000 })) ?? captionAz,
    captionRu: toNullableString(readString(record, 'captionRu', { nullable: true, maxLength: 2000 })) ?? captionAz,
  };
}

export function parseUpdateGalleryDto(body: unknown): UpdateGalleryDto {
  const record = ensureObject(body, 'gallery payload');
  ensureNoUnknownKeys(record, GALLERY_KEYS, 'gallery payload');
  ensureAtLeastOneField(record, GALLERY_KEYS, 'gallery payload');

  return {
    imageUrl: toOptionalString(readString(record, 'imageUrl', { minLength: 1, maxLength: 2000 })),
    captionAz: toNullableString(readString(record, 'captionAz', { nullable: true, maxLength: 2000 })),
    captionEn: toNullableString(readString(record, 'captionEn', { nullable: true, maxLength: 2000 })),
    captionRu: toNullableString(readString(record, 'captionRu', { nullable: true, maxLength: 2000 })),
  };
}
