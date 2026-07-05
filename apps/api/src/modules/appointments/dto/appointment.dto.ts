import { BadRequestException } from '@nestjs/common';
import {
  ensureNoUnknownKeys,
  ensureObject,
  readEmail,
  readString,
  toNullableString,
} from '../../../common/validation/validation.util';

const APPOINTMENT_CREATE_KEYS = [
  'fullName',
  'email',
  'phone',
  'serviceId',
  'serviceTitle',
  'preferredDate',
  'preferredTime',
  'message',
  'locale',
  'source',
] as const;

export type CreateAppointmentRequestDto = {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string | null;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  locale: string;
  source: string;
};

function fail(message: string): never {
  throw new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: `Validation failed: ${message}`,
    details: null,
  });
}

function normalizeLocale(value: string | null | undefined): string {
  if (value === 'en' || value === 'ru') {
    return value;
  }
  return 'az';
}

function assertDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))) {
    fail('"preferredDate" must be a valid date in YYYY-MM-DD format');
  }
  return value;
}

function assertTime(value: string): string {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    fail('"preferredTime" must be a valid time in HH:MM format');
  }
  return value;
}

export function parseCreateAppointmentRequestDto(body: unknown): CreateAppointmentRequestDto {
  const record = ensureObject(body, 'appointment payload');
  ensureNoUnknownKeys(record, APPOINTMENT_CREATE_KEYS, 'appointment payload');

  const fullName = readString(record, 'fullName', {
    required: true,
    minLength: 2,
    maxLength: 180,
  })!;
  const email = readEmail(record, 'email', {
    required: true,
    maxLength: 255,
  })!;
  const phone = readString(record, 'phone', {
    required: true,
    minLength: 7,
    maxLength: 50,
  })!;
  const serviceTitle = readString(record, 'serviceTitle', {
    required: true,
    minLength: 1,
    maxLength: 255,
  })!;
  const preferredDate = assertDate(
    readString(record, 'preferredDate', {
      required: true,
      minLength: 10,
      maxLength: 10,
    })!,
  );
  const preferredTime = assertTime(
    readString(record, 'preferredTime', {
      required: true,
      minLength: 5,
      maxLength: 5,
    })!,
  );

  return {
    fullName,
    email,
    phone,
    serviceId:
      toNullableString(
        readString(record, 'serviceId', { nullable: true, maxLength: 100 }),
      ) ?? null,
    serviceTitle,
    preferredDate,
    preferredTime,
    message:
      toNullableString(
        readString(record, 'message', { nullable: true, maxLength: 2000 }),
      ) ?? null,
    locale: normalizeLocale(readString(record, 'locale', { maxLength: 2 })),
    source:
      readString(record, 'source', { maxLength: 100 }) || 'homepage',
  };
}
