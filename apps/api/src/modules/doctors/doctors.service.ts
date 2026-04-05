import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@ultramed/database';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

type MediaSummary = {
  id: string;
  cdnUrl: string;
  mimeType: string;
};

type DoctorWithMedia = Prisma.DoctorGetPayload<{
  include: { media: true };
}>;

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    const doctors = await this.prisma.doctor.findMany({
      include: { media: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return doctors.map((doctor) => this.toAdminResponse(doctor));
  }

  async findOneAdmin(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!doctor) {
      return null;
    }

    return this.toAdminResponse(doctor);
  }

  async findAll(localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);

    const doctors = await this.prisma.doctor.findMany({
      where: { isPublished: true },
      include: { media: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      specialty:
        this.pickLocalizedField(doctor, 'title', locale) ?? doctor.specialty,
      bio: this.pickLocalizedField(doctor, 'bio', locale) ?? '',
      experience: doctor.experience ?? '',
      education: this.pickLocalizedField(doctor, 'education', locale) ?? '',
      tags: this.pickLocalizedTags(doctor, locale),
      image: this.resolveImage(doctor.image, doctor.media),
      media: this.toMediaSummary(doctor.media),
    }));
  }

  async findOne(id: string, localeRaw: string) {
    const locale = this.normalizeLocale(localeRaw);

    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!doctor || !doctor.isPublished) {
      return null;
    }

    return {
      id: doctor.id,
      name: doctor.name,
      specialty:
        this.pickLocalizedField(doctor, 'title', locale) ?? doctor.specialty,
      bio: this.pickLocalizedField(doctor, 'bio', locale) ?? '',
      profile: this.pickLocalizedField(doctor, 'profile', locale) ?? '',
      experience: doctor.experience ?? '',
      education: this.pickLocalizedField(doctor, 'education', locale) ?? '',
      educationDetails: this.buildEducationDetails(doctor, locale),
      experienceDetails: this.buildExperienceDetails(doctor, locale),
      certifications: this.buildCertificationDetails(doctor, locale),
      room: this.pickLocalizedField(doctor, 'room', locale) ?? '',
      schedule: this.pickLocalizedStringArray(doctor, 'schedule', locale),
      languages: this.pickLocalizedStringArray(doctor, 'languages', locale),
      procedures: this.pickLocalizedStringArray(doctor, 'procedures', locale),
      tags: this.pickLocalizedTags(doctor, locale),
      phone: doctor.phone ?? '',
      email: doctor.email ?? '',
      image: this.resolveImage(doctor.image, doctor.media),
      media: this.toMediaSummary(doctor.media),
    };
  }

  async create(data: CreateDoctorDto) {
    const {
      scheduleAz,
      scheduleEn,
      scheduleRu,
      languagesAz,
      languagesEn,
      languagesRu,
      proceduresAz,
      proceduresEn,
      proceduresRu,
      tagsAz,
      tagsEn,
      tagsRu,
      mediaId,
      ...rest
    } = data;
    const media = mediaId ? await this.requireMediaReference(mediaId) : null;

    const payload: Prisma.DoctorCreateInput = {
      ...rest,
      image: this.resolveImage(rest.image, media),
      scheduleAz: this.toNullableJsonArray(scheduleAz),
      scheduleEn: this.toNullableJsonArray(scheduleEn),
      scheduleRu: this.toNullableJsonArray(scheduleRu),
      languagesAz: this.toNullableJsonArray(languagesAz),
      languagesEn: this.toNullableJsonArray(languagesEn),
      languagesRu: this.toNullableJsonArray(languagesRu),
      proceduresAz: this.toNullableJsonArray(proceduresAz),
      proceduresEn: this.toNullableJsonArray(proceduresEn),
      proceduresRu: this.toNullableJsonArray(proceduresRu),
      tagsAz: this.toNullableJsonArray(tagsAz),
      tagsEn: this.toNullableJsonArray(tagsEn),
      tagsRu: this.toNullableJsonArray(tagsRu),
      ...(media ? { media: { connect: { id: media.id } } } : {}),
    };

    const doctor = await this.prisma.doctor.create({
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(doctor);
  }

  async update(id: string, data: UpdateDoctorDto) {
    const {
      scheduleAz,
      scheduleEn,
      scheduleRu,
      languagesAz,
      languagesEn,
      languagesRu,
      proceduresAz,
      proceduresEn,
      proceduresRu,
      tagsAz,
      tagsEn,
      tagsRu,
      mediaId,
      ...rest
    } = data;

    const payload: Prisma.DoctorUpdateInput = {
      ...rest,
      scheduleAz: this.toNullableJsonArray(scheduleAz),
      scheduleEn: this.toNullableJsonArray(scheduleEn),
      scheduleRu: this.toNullableJsonArray(scheduleRu),
      languagesAz: this.toNullableJsonArray(languagesAz),
      languagesEn: this.toNullableJsonArray(languagesEn),
      languagesRu: this.toNullableJsonArray(languagesRu),
      proceduresAz: this.toNullableJsonArray(proceduresAz),
      proceduresEn: this.toNullableJsonArray(proceduresEn),
      proceduresRu: this.toNullableJsonArray(proceduresRu),
      tagsAz: this.toNullableJsonArray(tagsAz),
      tagsEn: this.toNullableJsonArray(tagsEn),
      tagsRu: this.toNullableJsonArray(tagsRu),
    };

    if (mediaId !== undefined) {
      if (mediaId === null) {
        payload.media = { disconnect: true };
        if (rest.image === undefined) {
          payload.image = null;
        }
      } else {
        const media = await this.requireMediaReference(mediaId);
        payload.media = { connect: { id: media.id } };
        if (rest.image === undefined) {
          payload.image = media.cdnUrl;
        }
      }
    }

    const doctor = await this.prisma.doctor.update({
      where: { id },
      data: payload,
      include: { media: true },
    });

    return this.toAdminResponse(doctor);
  }

  async remove(id: string) {
    return this.prisma.doctor.delete({
      where: { id },
    });
  }

  private normalizeLocale(locale: string): 'az' | 'en' | 'ru' {
    if (locale === 'en' || locale === 'ru') {
      return locale;
    }
    return 'az';
  }

  private pickLocalizedField(
    doctor: {
      titleAz: string;
      titleEn: string;
      titleRu: string;
      bioAz: string;
      bioEn: string;
      bioRu: string;
      profileAz: string | null;
      profileEn: string | null;
      profileRu: string | null;
      educationAz: string | null;
      educationEn: string | null;
      educationRu: string | null;
      educationDetailsAz: string | null;
      educationDetailsEn: string | null;
      educationDetailsRu: string | null;
      experienceDetailsAz: string | null;
      experienceDetailsEn: string | null;
      experienceDetailsRu: string | null;
      certificationsAz: string | null;
      certificationsEn: string | null;
      certificationsRu: string | null;
      roomAz: string | null;
      roomEn: string | null;
      roomRu: string | null;
    },
    base:
      | 'title'
      | 'bio'
      | 'education'
      | 'profile'
      | 'room'
      | 'educationDetails'
      | 'experienceDetails'
      | 'certifications',
    locale: 'az' | 'en' | 'ru',
  ): string | null {
    if (base === 'title') {
      if (locale === 'en') return doctor.titleEn;
      if (locale === 'ru') return doctor.titleRu;
      return doctor.titleAz;
    }

    if (base === 'bio') {
      if (locale === 'en') return doctor.bioEn;
      if (locale === 'ru') return doctor.bioRu;
      return doctor.bioAz;
    }

    if (base === 'profile') {
      if (locale === 'en') return doctor.profileEn;
      if (locale === 'ru') return doctor.profileRu;
      return doctor.profileAz;
    }

    if (base === 'room') {
      if (locale === 'en') return doctor.roomEn;
      if (locale === 'ru') return doctor.roomRu;
      return doctor.roomAz;
    }

    if (base === 'educationDetails') {
      if (locale === 'en') return doctor.educationDetailsEn;
      if (locale === 'ru') return doctor.educationDetailsRu;
      return doctor.educationDetailsAz;
    }

    if (base === 'experienceDetails') {
      if (locale === 'en') return doctor.experienceDetailsEn;
      if (locale === 'ru') return doctor.experienceDetailsRu;
      return doctor.experienceDetailsAz;
    }

    if (base === 'certifications') {
      if (locale === 'en') return doctor.certificationsEn;
      if (locale === 'ru') return doctor.certificationsRu;
      return doctor.certificationsAz;
    }

    if (locale === 'en') return doctor.educationEn;
    if (locale === 'ru') return doctor.educationRu;
    return doctor.educationAz;
  }

  private buildEducationDetails(
    doctor: {
      educationAz: string | null;
      educationEn: string | null;
      educationRu: string | null;
      educationDetailsAz: string | null;
      educationDetailsEn: string | null;
      educationDetailsRu: string | null;
    },
    locale: 'az' | 'en' | 'ru',
  ): string[] {
    const detailed = this.pickLocalizedOptionalString(
      locale,
      doctor.educationDetailsAz,
      doctor.educationDetailsEn,
      doctor.educationDetailsRu,
    );
    if (detailed) {
      return this.splitTextToItems(detailed);
    }

    return this.splitTextToItems(
      this.pickLocalizedOptionalString(
        locale,
        doctor.educationAz,
        doctor.educationEn,
        doctor.educationRu,
      ) ?? '',
    );
  }

  private buildExperienceDetails(
    doctor: {
      profileAz: string | null;
      profileEn: string | null;
      profileRu: string | null;
      bioAz: string;
      bioEn: string;
      bioRu: string;
      experienceDetailsAz: string | null;
      experienceDetailsEn: string | null;
      experienceDetailsRu: string | null;
      experience: string | null;
    },
    locale: 'az' | 'en' | 'ru',
  ): string[] {
    const detailed = this.pickLocalizedOptionalString(
      locale,
      doctor.experienceDetailsAz,
      doctor.experienceDetailsEn,
      doctor.experienceDetailsRu,
    );
    if (detailed) {
      return this.splitTextToItems(detailed);
    }

    return this.splitTextToItems(
      this.pickLocalizedOptionalString(
        locale,
        doctor.profileAz,
        doctor.profileEn,
        doctor.profileRu,
      ) ??
        this.pickLocalizedOptionalString(
          locale,
          doctor.bioAz,
          doctor.bioEn,
          doctor.bioRu,
        ) ??
        doctor.experience ??
        '',
    );
  }

  private buildCertificationDetails(
    doctor: {
      certificationsAz: string | null;
      certificationsEn: string | null;
      certificationsRu: string | null;
    },
    locale: 'az' | 'en' | 'ru',
  ): string[] {
    return this.splitTextToItems(
      this.pickLocalizedOptionalString(
        locale,
        doctor.certificationsAz,
        doctor.certificationsEn,
        doctor.certificationsRu,
      ) ?? '',
    );
  }

  private pickLocalizedOptionalString(
    locale: 'az' | 'en' | 'ru',
    az: string | null | undefined,
    en: string | null | undefined,
    ru: string | null | undefined,
  ): string | null {
    if (locale === 'en') {
      return en ?? null;
    }

    if (locale === 'ru') {
      return ru ?? null;
    }

    return az ?? null;
  }

  private splitTextToItems(value: string | null | undefined): string[] {
    if (!value) {
      return [];
    }

    return value
      .replace(/\r/g, '')
      .split('\n')
      .flatMap((part) => part.split(/(?<=[.!?])\s+/))
      .map((item) => item.replace(/^[-*•]\s*/, '').trim())
      .filter((item) => item.length > 0);
  }

  private pickLocalizedStringArray(
    doctor: {
      scheduleAz: unknown;
      scheduleEn: unknown;
      scheduleRu: unknown;
      languagesAz: unknown;
      languagesEn: unknown;
      languagesRu: unknown;
      proceduresAz: unknown;
      proceduresEn: unknown;
      proceduresRu: unknown;
    },
    base: 'schedule' | 'languages' | 'procedures',
    locale: 'az' | 'en' | 'ru',
  ): string[] {
    let raw: unknown;

    if (base === 'schedule') {
      raw =
        locale === 'en'
          ? doctor.scheduleEn
          : locale === 'ru'
            ? doctor.scheduleRu
            : doctor.scheduleAz;
    } else if (base === 'languages') {
      raw =
        locale === 'en'
          ? doctor.languagesEn
          : locale === 'ru'
            ? doctor.languagesRu
            : doctor.languagesAz;
    } else {
      raw =
        locale === 'en'
          ? doctor.proceduresEn
          : locale === 'ru'
            ? doctor.proceduresRu
            : doctor.proceduresAz;
    }

    if (Array.isArray(raw)) {
      return raw.filter((item): item is string => typeof item === 'string');
    }

    return [];
  }

  private pickLocalizedTags(
    doctor: {
      tagsAz: unknown;
      tagsEn: unknown;
      tagsRu: unknown;
    },
    locale: 'az' | 'en' | 'ru',
  ): string[] {
    const raw =
      locale === 'en'
        ? doctor.tagsEn
        : locale === 'ru'
          ? doctor.tagsRu
          : doctor.tagsAz;

    if (Array.isArray(raw)) {
      return raw.filter((tag): tag is string => typeof tag === 'string');
    }

    return [];
  }

  private toNullableJsonArray(
    value: string[] | null | undefined,
  ): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return Prisma.JsonNull;
    }

    return value as Prisma.InputJsonValue;
  }

  private resolveImage(
    image: string | null | undefined,
    media: { cdnUrl: string } | null | undefined,
  ): string | null {
    return media?.cdnUrl ?? image ?? null;
  }

  private toMediaSummary(
    media: { id: string; cdnUrl: string; mimeType: string } | null | undefined,
  ): MediaSummary | null {
    if (!media) {
      return null;
    }

    return {
      id: media.id,
      cdnUrl: media.cdnUrl,
      mimeType: media.mimeType,
    };
  }

  private toAdminResponse(doctor: DoctorWithMedia) {
    const { media, ...rest } = doctor;
    return {
      ...rest,
      image: this.resolveImage(rest.image, media),
      media: this.toMediaSummary(media),
    };
  }

  private async requireMediaReference(mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new HttpException(
        {
          code: 'MEDIA_REFERENCE_INVALID',
          message: 'Media reference is invalid',
          details: { mediaId },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return media;
  }
}
