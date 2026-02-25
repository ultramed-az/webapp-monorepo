import { BadRequestException } from '@nestjs/common';

export type UnknownRecord = Record<string, unknown>;

type StringOptions = {
  required?: boolean;
  nullable?: boolean;
  trim?: boolean;
  minLength?: number;
  maxLength?: number;
};

type NumberOptions = {
  required?: boolean;
  nullable?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
};

type BooleanOptions = {
  required?: boolean;
  nullable?: boolean;
};

type StringArrayOptions = {
  required?: boolean;
  nullable?: boolean;
  minItems?: number;
  maxItems?: number;
  itemMaxLength?: number;
};

type ObjectArrayOptions = {
  required?: boolean;
  nullable?: boolean;
  minItems?: number;
  maxItems?: number;
};

function fail(message: string): never {
  throw new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: `Validation failed: ${message}`,
    details: null,
  });
}

function hasOwn(record: UnknownRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

export function ensureObject(value: unknown, context = 'payload'): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${context} must be an object`);
  }

  return value as UnknownRecord;
}

export function ensureNoUnknownKeys(
  record: UnknownRecord,
  allowedKeys: readonly string[],
  context = 'payload',
): void {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      fail(`${context} contains unknown field "${key}"`);
    }
  }
}

export function ensureAtLeastOneField(record: UnknownRecord, keys: readonly string[], context = 'payload'): void {
  const hasAny = keys.some((key) => hasOwn(record, key));
  if (!hasAny) {
    fail(`${context} must include at least one editable field`);
  }
}

export function readString(record: UnknownRecord, key: string, options: StringOptions = {}): string | null | undefined {
  const {
    required = false,
    nullable = false,
    trim = true,
    minLength,
    maxLength,
  } = options;

  if (!hasOwn(record, key)) {
    if (required) {
      fail(`"${key}" is required`);
    }
    return undefined;
  }

  const raw = record[key];

  if (raw === null) {
    if (nullable) {
      return null;
    }
    fail(`"${key}" cannot be null`);
  }

  if (typeof raw !== 'string') {
    fail(`"${key}" must be a string`);
  }

  const value = trim ? raw.trim() : raw;

  if (required && value.length === 0) {
    fail(`"${key}" cannot be empty`);
  }

  if (typeof minLength === 'number' && value.length < minLength) {
    fail(`"${key}" must be at least ${minLength} characters`);
  }

  if (typeof maxLength === 'number' && value.length > maxLength) {
    fail(`"${key}" must be at most ${maxLength} characters`);
  }

  return value;
}

export function readNumber(record: UnknownRecord, key: string, options: NumberOptions = {}): number | null | undefined {
  const {
    required = false,
    nullable = false,
    min,
    max,
    integer = false,
  } = options;

  if (!hasOwn(record, key)) {
    if (required) {
      fail(`"${key}" is required`);
    }
    return undefined;
  }

  const raw = record[key];

  if (raw === null) {
    if (nullable) {
      return null;
    }
    fail(`"${key}" cannot be null`);
  }

  if (typeof raw !== 'number' || Number.isNaN(raw)) {
    fail(`"${key}" must be a number`);
  }

  if (integer && !Number.isInteger(raw)) {
    fail(`"${key}" must be an integer`);
  }

  if (typeof min === 'number' && raw < min) {
    fail(`"${key}" must be >= ${min}`);
  }

  if (typeof max === 'number' && raw > max) {
    fail(`"${key}" must be <= ${max}`);
  }

  return raw;
}

export function readBoolean(record: UnknownRecord, key: string, options: BooleanOptions = {}): boolean | null | undefined {
  const { required = false, nullable = false } = options;

  if (!hasOwn(record, key)) {
    if (required) {
      fail(`"${key}" is required`);
    }
    return undefined;
  }

  const raw = record[key];

  if (raw === null) {
    if (nullable) {
      return null;
    }
    fail(`"${key}" cannot be null`);
  }

  if (typeof raw !== 'boolean') {
    fail(`"${key}" must be a boolean`);
  }

  return raw;
}

export function readStringArray(
  record: UnknownRecord,
  key: string,
  options: StringArrayOptions = {},
): string[] | null | undefined {
  const {
    required = false,
    nullable = false,
    minItems,
    maxItems,
    itemMaxLength = 1000,
  } = options;

  if (!hasOwn(record, key)) {
    if (required) {
      fail(`"${key}" is required`);
    }
    return undefined;
  }

  const raw = record[key];

  if (raw === null) {
    if (nullable) {
      return null;
    }
    fail(`"${key}" cannot be null`);
  }

  if (!Array.isArray(raw)) {
    fail(`"${key}" must be an array`);
  }

  const normalized = raw.map((item, index) => {
    if (typeof item !== 'string') {
      fail(`"${key}[${index}]" must be a string`);
    }

    const value = item.trim();
    if (value.length === 0) {
      fail(`"${key}[${index}]" cannot be empty`);
    }

    if (value.length > itemMaxLength) {
      fail(`"${key}[${index}]" exceeds ${itemMaxLength} characters`);
    }

    return value;
  });

  if (typeof minItems === 'number' && normalized.length < minItems) {
    fail(`"${key}" must include at least ${minItems} items`);
  }

  if (typeof maxItems === 'number' && normalized.length > maxItems) {
    fail(`"${key}" must include at most ${maxItems} items`);
  }

  return normalized;
}

export function readIsoDateString(
  record: UnknownRecord,
  key: string,
  options: StringOptions = {},
): string | null | undefined {
  const value = readString(record, key, options);
  if (value === undefined || value === null) {
    return value;
  }

  if (!Number.isFinite(Date.parse(value))) {
    fail(`"${key}" must be a valid ISO date string`);
  }

  return value;
}

export function readUnknown(record: UnknownRecord, key: string): unknown {
  if (!hasOwn(record, key)) {
    return undefined;
  }
  return record[key];
}

export function readObjectArray(
  record: UnknownRecord,
  key: string,
  options: ObjectArrayOptions = {},
): UnknownRecord[] | null | undefined {
  const { required = false, nullable = false, minItems, maxItems } = options;

  if (!hasOwn(record, key)) {
    if (required) {
      fail(`"${key}" is required`);
    }
    return undefined;
  }

  const raw = record[key];

  if (raw === null) {
    if (nullable) {
      return null;
    }
    fail(`"${key}" cannot be null`);
  }

  if (!Array.isArray(raw)) {
    fail(`"${key}" must be an array`);
  }

  const normalized = raw.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      fail(`"${key}[${index}]" must be an object`);
    }
    return item as UnknownRecord;
  });

  if (typeof minItems === 'number' && normalized.length < minItems) {
    fail(`"${key}" must include at least ${minItems} items`);
  }

  if (typeof maxItems === 'number' && normalized.length > maxItems) {
    fail(`"${key}" must include at most ${maxItems} items`);
  }

  return normalized;
}

export function toNullableString(value: string | null | undefined): string | null | undefined {
  if (value === undefined || value === null) {
    return value;
  }
  return value.length === 0 ? null : value;
}

export function toOptionalString(value: string | null | undefined): string | undefined {
  return value === null ? undefined : value;
}

export function toOptionalNumber(value: number | null | undefined): number | undefined {
  return value === null ? undefined : value;
}

export function toOptionalBoolean(value: boolean | null | undefined): boolean | undefined {
  return value === null ? undefined : value;
}

export function toOptionalStringArray(value: string[] | null | undefined): string[] | undefined {
  return value === null ? undefined : value;
}

export function toOptionalObjectArray<T extends UnknownRecord>(
  value: T[] | null | undefined,
): T[] | undefined {
  return value === null ? undefined : value;
}

export function readEmail(record: UnknownRecord, key: string, options: StringOptions = {}): string | null | undefined {
  const value = readString(record, key, options);
  if (value === undefined || value === null || value.length === 0) {
    return value;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    fail(`"${key}" must be a valid email address`);
  }

  return value;
}

export function readUrl(record: UnknownRecord, key: string, options: StringOptions = {}): string | null | undefined {
  const value = readString(record, key, options);
  if (value === undefined || value === null || value.length === 0) {
    return value;
  }

  try {
    // eslint-disable-next-line no-new
    new URL(value);
  } catch {
    fail(`"${key}" must be a valid URL`);
  }

  return value;
}
