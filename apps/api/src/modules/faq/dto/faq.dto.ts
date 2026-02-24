import {
  ensureAtLeastOneField,
  ensureNoUnknownKeys,
  ensureObject,
  readString,
  toOptionalString,
} from '../../../common/validation/validation.util';

const FAQ_KEYS = ['questionAz', 'questionEn', 'questionRu', 'answerAz', 'answerEn', 'answerRu'] as const;

export type CreateFaqDto = {
  questionAz: string;
  questionEn: string;
  questionRu: string;
  answerAz: string;
  answerEn: string;
  answerRu: string;
};

export type UpdateFaqDto = Partial<CreateFaqDto>;

export function parseCreateFaqDto(body: unknown): CreateFaqDto {
  const record = ensureObject(body, 'faq payload');
  ensureNoUnknownKeys(record, FAQ_KEYS, 'faq payload');

  const questionAz = readString(record, 'questionAz', { required: true, minLength: 1, maxLength: 1000 })!;
  const answerAz = readString(record, 'answerAz', { required: true, minLength: 1, maxLength: 30000 })!;

  return {
    questionAz,
    questionEn: readString(record, 'questionEn', { maxLength: 1000 }) || questionAz,
    questionRu: readString(record, 'questionRu', { maxLength: 1000 }) || questionAz,
    answerAz,
    answerEn: readString(record, 'answerEn', { maxLength: 30000 }) || answerAz,
    answerRu: readString(record, 'answerRu', { maxLength: 30000 }) || answerAz,
  };
}

export function parseUpdateFaqDto(body: unknown): UpdateFaqDto {
  const record = ensureObject(body, 'faq payload');
  ensureNoUnknownKeys(record, FAQ_KEYS, 'faq payload');
  ensureAtLeastOneField(record, FAQ_KEYS, 'faq payload');

  return {
    questionAz: toOptionalString(readString(record, 'questionAz', { minLength: 1, maxLength: 1000 })),
    questionEn: toOptionalString(readString(record, 'questionEn', { minLength: 1, maxLength: 1000 })),
    questionRu: toOptionalString(readString(record, 'questionRu', { minLength: 1, maxLength: 1000 })),
    answerAz: toOptionalString(readString(record, 'answerAz', { minLength: 1, maxLength: 30000 })),
    answerEn: toOptionalString(readString(record, 'answerEn', { minLength: 1, maxLength: 30000 })),
    answerRu: toOptionalString(readString(record, 'answerRu', { minLength: 1, maxLength: 30000 })),
  };
}
