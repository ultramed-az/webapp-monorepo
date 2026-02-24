import { BadRequestException } from '@nestjs/common';
import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readNumber,
  readString,
  toOptionalNumber,
  toOptionalString,
} from '../../../common/validation/validation.util';

const HOME_STAT_CREATE_KEYS = ['id', 'value', 'sortOrder'] as const;
const HOME_STAT_UPDATE_KEYS = ['value', 'sortOrder'] as const;

const HOME_STAT_ID_REGEX = /^[a-zA-Z0-9_-]{2,64}$/;

export type CreateHomeStatDto = {
  id: string;
  value: string;
  sortOrder: number;
};

export type UpdateHomeStatDto = Partial<Omit<CreateHomeStatDto, 'id'>>;

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
