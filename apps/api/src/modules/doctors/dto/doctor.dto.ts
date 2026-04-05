import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readBoolean,
  readEmail,
  readNumber,
  readString,
  readStringArray,
  toOptionalBoolean,
  toOptionalNumber,
  toOptionalString,
  toOptionalStringArray,
  toNullableString,
} from '../../../common/validation/validation.util';

const DOCTOR_KEYS = [
  'name',
  'titleAz',
  'titleEn',
  'titleRu',
  'bioAz',
  'bioEn',
  'bioRu',
  'profileAz',
  'profileEn',
  'profileRu',
  'image',
  'mediaId',
  'specialty',
  'experience',
  'educationAz',
  'educationEn',
  'educationRu',
  'educationDetailsAz',
  'educationDetailsEn',
  'educationDetailsRu',
  'experienceDetailsAz',
  'experienceDetailsEn',
  'experienceDetailsRu',
  'certificationsAz',
  'certificationsEn',
  'certificationsRu',
  'roomAz',
  'roomEn',
  'roomRu',
  'scheduleAz',
  'scheduleEn',
  'scheduleRu',
  'languagesAz',
  'languagesEn',
  'languagesRu',
  'proceduresAz',
  'proceduresEn',
  'proceduresRu',
  'phone',
  'email',
  'tagsAz',
  'tagsEn',
  'tagsRu',
  'sortOrder',
  'isPublished',
] as const;

type OptionalNullableString = string | null;
type OptionalStringArray = string[] | null;

export type CreateDoctorDto = {
  name: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  bioAz: string;
  bioEn: string;
  bioRu: string;
  profileAz: OptionalNullableString;
  profileEn: OptionalNullableString;
  profileRu: OptionalNullableString;
  image: OptionalNullableString;
  mediaId: OptionalNullableString;
  specialty: string;
  experience: OptionalNullableString;
  educationAz: OptionalNullableString;
  educationEn: OptionalNullableString;
  educationRu: OptionalNullableString;
  educationDetailsAz: OptionalNullableString;
  educationDetailsEn: OptionalNullableString;
  educationDetailsRu: OptionalNullableString;
  experienceDetailsAz: OptionalNullableString;
  experienceDetailsEn: OptionalNullableString;
  experienceDetailsRu: OptionalNullableString;
  certificationsAz: OptionalNullableString;
  certificationsEn: OptionalNullableString;
  certificationsRu: OptionalNullableString;
  roomAz: OptionalNullableString;
  roomEn: OptionalNullableString;
  roomRu: OptionalNullableString;
  scheduleAz: OptionalStringArray;
  scheduleEn: OptionalStringArray;
  scheduleRu: OptionalStringArray;
  languagesAz: OptionalStringArray;
  languagesEn: OptionalStringArray;
  languagesRu: OptionalStringArray;
  proceduresAz: OptionalStringArray;
  proceduresEn: OptionalStringArray;
  proceduresRu: OptionalStringArray;
  phone: OptionalNullableString;
  email: OptionalNullableString;
  tagsAz: OptionalStringArray;
  tagsEn: OptionalStringArray;
  tagsRu: OptionalStringArray;
  sortOrder: number;
  isPublished: boolean;
};

export type UpdateDoctorDto = Partial<CreateDoctorDto>;

function readLocalizedStringArray(
  record: Record<string, unknown>,
  key: string,
): string[] | null | undefined {
  return readStringArray(record, key, {
    nullable: true,
    maxItems: 100,
    itemMaxLength: 300,
  });
}

export function parseCreateDoctorDto(body: unknown): CreateDoctorDto {
  const record = ensureObject(body, 'doctor payload');
  ensureNoUnknownKeys(record, DOCTOR_KEYS, 'doctor payload');

  const titleAz = readString(record, 'titleAz', {
    required: true,
    minLength: 1,
    maxLength: 255,
  })!;
  const bioAz = readString(record, 'bioAz', {
    required: true,
    minLength: 1,
    maxLength: 20000,
  })!;

  return {
    name: readString(record, 'name', {
      required: true,
      minLength: 1,
      maxLength: 200,
    })!,
    titleAz,
    titleEn: readString(record, 'titleEn', { maxLength: 255 }) || titleAz,
    titleRu: readString(record, 'titleRu', { maxLength: 255 }) || titleAz,
    bioAz,
    bioEn: readString(record, 'bioEn', { maxLength: 20000 }) || bioAz,
    bioRu: readString(record, 'bioRu', { maxLength: 20000 }) || bioAz,
    profileAz:
      toNullableString(
        readString(record, 'profileAz', { nullable: true, maxLength: 20000 }),
      ) ?? null,
    profileEn:
      toNullableString(
        readString(record, 'profileEn', { nullable: true, maxLength: 20000 }),
      ) ?? null,
    profileRu:
      toNullableString(
        readString(record, 'profileRu', { nullable: true, maxLength: 20000 }),
      ) ?? null,
    image:
      toNullableString(
        readString(record, 'image', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    mediaId:
      toNullableString(
        readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
      ) ?? null,
    specialty: readString(record, 'specialty', {
      required: true,
      minLength: 1,
      maxLength: 255,
    })!,
    experience:
      toNullableString(
        readString(record, 'experience', { nullable: true, maxLength: 255 }),
      ) ?? null,
    educationAz:
      toNullableString(
        readString(record, 'educationAz', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    educationEn:
      toNullableString(
        readString(record, 'educationEn', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    educationRu:
      toNullableString(
        readString(record, 'educationRu', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    educationDetailsAz:
      toNullableString(
        readString(record, 'educationDetailsAz', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    educationDetailsEn:
      toNullableString(
        readString(record, 'educationDetailsEn', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    educationDetailsRu:
      toNullableString(
        readString(record, 'educationDetailsRu', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    experienceDetailsAz:
      toNullableString(
        readString(record, 'experienceDetailsAz', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    experienceDetailsEn:
      toNullableString(
        readString(record, 'experienceDetailsEn', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    experienceDetailsRu:
      toNullableString(
        readString(record, 'experienceDetailsRu', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    certificationsAz:
      toNullableString(
        readString(record, 'certificationsAz', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    certificationsEn:
      toNullableString(
        readString(record, 'certificationsEn', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    certificationsRu:
      toNullableString(
        readString(record, 'certificationsRu', {
          nullable: true,
          maxLength: 20000,
        }),
      ) ?? null,
    roomAz:
      toNullableString(
        readString(record, 'roomAz', { nullable: true, maxLength: 255 }),
      ) ?? null,
    roomEn:
      toNullableString(
        readString(record, 'roomEn', { nullable: true, maxLength: 255 }),
      ) ?? null,
    roomRu:
      toNullableString(
        readString(record, 'roomRu', { nullable: true, maxLength: 255 }),
      ) ?? null,
    scheduleAz: readLocalizedStringArray(record, 'scheduleAz') ?? [],
    scheduleEn: readLocalizedStringArray(record, 'scheduleEn') ?? [],
    scheduleRu: readLocalizedStringArray(record, 'scheduleRu') ?? [],
    languagesAz: readLocalizedStringArray(record, 'languagesAz') ?? [],
    languagesEn: readLocalizedStringArray(record, 'languagesEn') ?? [],
    languagesRu: readLocalizedStringArray(record, 'languagesRu') ?? [],
    proceduresAz: readLocalizedStringArray(record, 'proceduresAz') ?? [],
    proceduresEn: readLocalizedStringArray(record, 'proceduresEn') ?? [],
    proceduresRu: readLocalizedStringArray(record, 'proceduresRu') ?? [],
    phone:
      toNullableString(
        readString(record, 'phone', { nullable: true, maxLength: 80 }),
      ) ?? null,
    email:
      toNullableString(
        readEmail(record, 'email', { nullable: true, maxLength: 320 }),
      ) ?? null,
    tagsAz: readLocalizedStringArray(record, 'tagsAz') ?? [],
    tagsEn: readLocalizedStringArray(record, 'tagsEn') ?? [],
    tagsRu: readLocalizedStringArray(record, 'tagsRu') ?? [],
    sortOrder: readNumber(record, 'sortOrder', { integer: true }) ?? 0,
    isPublished: readBoolean(record, 'isPublished') ?? true,
  };
}

export function parseUpdateDoctorDto(body: unknown): UpdateDoctorDto {
  const record = ensureObject(body, 'doctor payload');
  ensureNoUnknownKeys(record, DOCTOR_KEYS, 'doctor payload');
  ensureAtLeastOneField(record, DOCTOR_KEYS, 'doctor payload');

  return {
    name: toOptionalString(
      readString(record, 'name', { minLength: 1, maxLength: 200 }),
    ),
    titleAz: toOptionalString(
      readString(record, 'titleAz', { minLength: 1, maxLength: 255 }),
    ),
    titleEn: toOptionalString(
      readString(record, 'titleEn', { minLength: 1, maxLength: 255 }),
    ),
    titleRu: toOptionalString(
      readString(record, 'titleRu', { minLength: 1, maxLength: 255 }),
    ),
    bioAz: toOptionalString(
      readString(record, 'bioAz', { minLength: 1, maxLength: 20000 }),
    ),
    bioEn: toOptionalString(
      readString(record, 'bioEn', { minLength: 1, maxLength: 20000 }),
    ),
    bioRu: toOptionalString(
      readString(record, 'bioRu', { minLength: 1, maxLength: 20000 }),
    ),
    profileAz: toNullableString(
      readString(record, 'profileAz', { nullable: true, maxLength: 20000 }),
    ),
    profileEn: toNullableString(
      readString(record, 'profileEn', { nullable: true, maxLength: 20000 }),
    ),
    profileRu: toNullableString(
      readString(record, 'profileRu', { nullable: true, maxLength: 20000 }),
    ),
    image: toNullableString(
      readString(record, 'image', { nullable: true, maxLength: 2000 }),
    ),
    mediaId: toNullableString(
      readString(record, 'mediaId', { nullable: true, maxLength: 64 }),
    ),
    specialty: toOptionalString(
      readString(record, 'specialty', { minLength: 1, maxLength: 255 }),
    ),
    experience: toNullableString(
      readString(record, 'experience', { nullable: true, maxLength: 255 }),
    ),
    educationAz: toNullableString(
      readString(record, 'educationAz', { nullable: true, maxLength: 2000 }),
    ),
    educationEn: toNullableString(
      readString(record, 'educationEn', { nullable: true, maxLength: 2000 }),
    ),
    educationRu: toNullableString(
      readString(record, 'educationRu', { nullable: true, maxLength: 2000 }),
    ),
    educationDetailsAz: toNullableString(
      readString(record, 'educationDetailsAz', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    educationDetailsEn: toNullableString(
      readString(record, 'educationDetailsEn', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    educationDetailsRu: toNullableString(
      readString(record, 'educationDetailsRu', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    experienceDetailsAz: toNullableString(
      readString(record, 'experienceDetailsAz', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    experienceDetailsEn: toNullableString(
      readString(record, 'experienceDetailsEn', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    experienceDetailsRu: toNullableString(
      readString(record, 'experienceDetailsRu', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    certificationsAz: toNullableString(
      readString(record, 'certificationsAz', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    certificationsEn: toNullableString(
      readString(record, 'certificationsEn', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    certificationsRu: toNullableString(
      readString(record, 'certificationsRu', {
        nullable: true,
        maxLength: 20000,
      }),
    ),
    roomAz: toNullableString(
      readString(record, 'roomAz', { nullable: true, maxLength: 255 }),
    ),
    roomEn: toNullableString(
      readString(record, 'roomEn', { nullable: true, maxLength: 255 }),
    ),
    roomRu: toNullableString(
      readString(record, 'roomRu', { nullable: true, maxLength: 255 }),
    ),
    scheduleAz: toOptionalStringArray(
      readLocalizedStringArray(record, 'scheduleAz'),
    ),
    scheduleEn: toOptionalStringArray(
      readLocalizedStringArray(record, 'scheduleEn'),
    ),
    scheduleRu: toOptionalStringArray(
      readLocalizedStringArray(record, 'scheduleRu'),
    ),
    languagesAz: toOptionalStringArray(
      readLocalizedStringArray(record, 'languagesAz'),
    ),
    languagesEn: toOptionalStringArray(
      readLocalizedStringArray(record, 'languagesEn'),
    ),
    languagesRu: toOptionalStringArray(
      readLocalizedStringArray(record, 'languagesRu'),
    ),
    proceduresAz: toOptionalStringArray(
      readLocalizedStringArray(record, 'proceduresAz'),
    ),
    proceduresEn: toOptionalStringArray(
      readLocalizedStringArray(record, 'proceduresEn'),
    ),
    proceduresRu: toOptionalStringArray(
      readLocalizedStringArray(record, 'proceduresRu'),
    ),
    phone: toNullableString(
      readString(record, 'phone', { nullable: true, maxLength: 80 }),
    ),
    email: toNullableString(
      readEmail(record, 'email', { nullable: true, maxLength: 320 }),
    ),
    tagsAz: toOptionalStringArray(readLocalizedStringArray(record, 'tagsAz')),
    tagsEn: toOptionalStringArray(readLocalizedStringArray(record, 'tagsEn')),
    tagsRu: toOptionalStringArray(readLocalizedStringArray(record, 'tagsRu')),
    sortOrder: toOptionalNumber(
      readNumber(record, 'sortOrder', { integer: true }),
    ),
    isPublished: toOptionalBoolean(readBoolean(record, 'isPublished')),
  };
}
