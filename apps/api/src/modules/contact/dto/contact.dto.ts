import {
  UnknownRecord,
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readNumber,
  readObjectArray,
  readString,
  toOptionalNumber,
  toOptionalString,
} from '../../../common/validation/validation.util';

const CONTACT_CREATE_KEYS = [
  'slug',
  'addressAz',
  'addressEn',
  'addressRu',
  'mapLatitude',
  'mapLongitude',
  'mapEmbedUrl',
  'phones',
  'emails',
  'workingHours',
] as const;

const CONTACT_UPDATE_KEYS = [
  'addressAz',
  'addressEn',
  'addressRu',
  'mapLatitude',
  'mapLongitude',
  'mapEmbedUrl',
  'phones',
  'emails',
  'workingHours',
] as const;

type ContactItemKey = 'phones' | 'emails' | 'workingHours';

export type ContactLocalizedItemDto = {
  labelAz: string;
  labelEn: string;
  labelRu: string;
  value: string;
};

export type CreateContactInfoDto = {
  slug: string;
  addressAz: string;
  addressEn: string;
  addressRu: string;
  mapLatitude: number;
  mapLongitude: number;
  mapEmbedUrl: string;
  phones: ContactLocalizedItemDto[];
  emails: ContactLocalizedItemDto[];
  workingHours: ContactLocalizedItemDto[];
};

export type UpdateContactInfoDto = Partial<Omit<CreateContactInfoDto, 'slug'>>;

function parseLocalizedItems(
  record: Record<string, unknown>,
  key: ContactItemKey,
): ContactLocalizedItemDto[] | undefined {
  const rawItems = readObjectArray(record, key, { maxItems: 100 });
  if (rawItems === undefined || rawItems === null) {
    return undefined;
  }

  return rawItems.map((item, index) => parseLocalizedItem(item, `${key}[${index}]`));
}

function parseLocalizedItem(item: UnknownRecord, context: string): ContactLocalizedItemDto {
  ensureNoUnknownKeys(item, ['labelAz', 'labelEn', 'labelRu', 'value'], context);

  return {
    labelAz: readString(item, 'labelAz', { maxLength: 255 }) || '',
    labelEn: readString(item, 'labelEn', { maxLength: 255 }) || '',
    labelRu: readString(item, 'labelRu', { maxLength: 255 }) || '',
    value: readString(item, 'value', { required: true, minLength: 1, maxLength: 500 })!,
  };
}

export function parseCreateContactInfoDto(body: unknown): CreateContactInfoDto {
  const record = ensureObject(body, 'contact payload');
  ensureNoUnknownKeys(record, CONTACT_CREATE_KEYS, 'contact payload');

  const addressAz = readString(record, 'addressAz', { required: true, minLength: 1, maxLength: 500 })!;

  return {
    slug: readString(record, 'slug', { maxLength: 120 }) || 'main',
    addressAz,
    addressEn: readString(record, 'addressEn', { maxLength: 500 }) || addressAz,
    addressRu: readString(record, 'addressRu', { maxLength: 500 }) || addressAz,
    mapLatitude: readNumber(record, 'mapLatitude', { required: true, min: -90, max: 90 })!,
    mapLongitude: readNumber(record, 'mapLongitude', { required: true, min: -180, max: 180 })!,
    mapEmbedUrl: readString(record, 'mapEmbedUrl', { required: true, minLength: 1, maxLength: 10000 })!,
    phones: parseLocalizedItems(record, 'phones') ?? [],
    emails: parseLocalizedItems(record, 'emails') ?? [],
    workingHours: parseLocalizedItems(record, 'workingHours') ?? [],
  };
}

export function parseUpdateContactInfoDto(body: unknown): UpdateContactInfoDto {
  const record = ensureObject(body, 'contact payload');
  ensureNoUnknownKeys(record, CONTACT_UPDATE_KEYS, 'contact payload');
  ensureAtLeastOneField(record, CONTACT_UPDATE_KEYS, 'contact payload');

  return {
    addressAz: toOptionalString(readString(record, 'addressAz', { minLength: 1, maxLength: 500 })),
    addressEn: toOptionalString(readString(record, 'addressEn', { minLength: 1, maxLength: 500 })),
    addressRu: toOptionalString(readString(record, 'addressRu', { minLength: 1, maxLength: 500 })),
    mapLatitude: toOptionalNumber(readNumber(record, 'mapLatitude', { min: -90, max: 90 })),
    mapLongitude: toOptionalNumber(readNumber(record, 'mapLongitude', { min: -180, max: 180 })),
    mapEmbedUrl: toOptionalString(readString(record, 'mapEmbedUrl', { minLength: 1, maxLength: 10000 })),
    phones: parseLocalizedItems(record, 'phones'),
    emails: parseLocalizedItems(record, 'emails'),
    workingHours: parseLocalizedItems(record, 'workingHours'),
  };
}
