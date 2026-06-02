'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    Award,
    BriefcaseBusiness,
    Calendar,
    ChevronLeft,
    HeartPulse,
    Stethoscope,
    UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getDoctorById, getDoctors, isBackendUnavailableError, type DoctorDetailItem, type DoctorListItem } from '@/lib/api';
import { shouldBypassImageOptimization } from '@/lib/image';

function normalizeLocale(localeRaw: string | undefined): 'az' | 'en' | 'ru' {
    if (localeRaw === 'en' || localeRaw === 'ru') {
        return localeRaw;
    }

    return 'az';
}

function formatReadableText(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    return value
        .replace(/\r/g, '')
        .replace(/\bDr\.\s+/g, 'Dr__SPACE__')
        .replace(/\bProf\.\s+/g, 'Prof__SPACE__')
        .split('\n')
        .flatMap((part) => part.split(/(?<=[.!?])\s+/))
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
        .map((part) => part.replace(/Dr__SPACE__/g, 'Dr. ').replace(/Prof__SPACE__/g, 'Prof. '))
        .join('\n');
}

function DoctorDetailSkeleton() {
    return (
        <div className="space-y-10">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-center">
                    <div className="flex justify-center lg:justify-start">
                        <Skeleton className="h-64 w-64 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-40 rounded-full" />
                        <Skeleton className="h-14 w-3/4" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-[90%]" />
                        <Skeleton className="h-12 w-48 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="space-y-6">
                    <Skeleton className="h-72 w-full rounded-[2rem]" />
                    <Skeleton className="h-96 w-full rounded-[2rem]" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-56 w-full rounded-[2rem]" />
                    <Skeleton className="h-[420px] w-full rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
}

export default function DoctorDetailPage() {
    const params = useParams<{ locale: string; id: string }>();
    const locale = normalizeLocale(params?.locale);
    const doctorId = params?.id;

    const tList = useTranslations('DoctorsPage');
    const t = useTranslations('DoctorDetailPage');

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [doctor, setDoctor] = useState<DoctorDetailItem | null>(null);
    const [allDoctors, setAllDoctors] = useState<DoctorListItem[]>([]);

    useEffect(() => {
        let isCancelled = false;

        async function loadDoctorPage() {
            setIsLoading(true);
            setError(null);
            setIsUnavailable(false);

            try {
                const [doctorDetail, doctors] = await Promise.all([
                    doctorId ? getDoctorById(doctorId, locale) : Promise.resolve(null),
                    getDoctors(locale),
                ]);

                if (!isCancelled) {
                    setDoctor(doctorDetail);
                    setAllDoctors(doctors);
                }
            } catch (fetchError) {
                if (isCancelled) {
                    return;
                }

                if (isBackendUnavailableError(fetchError)) {
                    setIsUnavailable(true);
                    return;
                }

                const message = fetchError instanceof Error ? fetchError.message : tList('detailLoadFailed');
                setError(message);
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadDoctorPage();

        return () => {
            isCancelled = true;
        };
    }, [doctorId, locale, refreshKey, tList]);

    const relatedDoctors = useMemo(
        () => allDoctors.filter((item) => item.id !== doctorId).slice(0, 6),
        [allDoctors, doctorId],
    );

    const formattedBio = useMemo(() => formatReadableText(doctor?.bio ?? ''), [doctor?.bio]);
    const formattedProfile = useMemo(
        () => formatReadableText(doctor?.profile || doctor?.bio || ''),
        [doctor?.bio, doctor?.profile],
    );

    const imageSrc = doctor?.image || '/logo.png';

    if (isUnavailable && !doctor) {
        return (
            <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
                <div className="container mx-auto max-w-4xl">
                    <TemporaryUnavailable onRetry={() => setRefreshKey((key) => key + 1)} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream/35 py-10 lg:py-14">
            <div className="container mx-auto px-6">
                <Link
                    href={`/${locale}/doctors`}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-blue transition-colors hover:text-brand-blue-dark"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t('backToDoctors')}
                </Link>

                {isLoading ? (
                    <DoctorDetailSkeleton />
                ) : error ? (
                    <div className="rounded-[2rem] border border-slate-100 bg-white px-8 py-16 text-center shadow-sm">
                        <h2 className="mb-3 text-2xl font-bold text-slate-900">{t('notFoundTitle')}</h2>
                        <p className="mx-auto max-w-xl text-slate-600">{error}</p>
                        <Button asChild className="mt-6 bg-brand-orange text-white hover:bg-brand-orange-dark">
                            <Link href={`/${locale}/doctors`}>{t('backToDoctors')}</Link>
                        </Button>
                    </div>
                ) : !doctor ? (
                    <div className="rounded-[2rem] border border-slate-100 bg-white px-8 py-16 text-center shadow-sm">
                        <h2 className="mb-3 text-2xl font-bold text-slate-900">{t('notFoundTitle')}</h2>
                        <p className="mx-auto max-w-xl text-slate-600">{t('notFoundDescription')}</p>
                        <Button asChild className="mt-6 bg-brand-orange text-white hover:bg-brand-orange-dark">
                            <Link href={`/${locale}/doctors`}>{t('backToDoctors')}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <section className="overflow-hidden rounded-[2rem] border border-brand-blue/10 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
                                <div className="relative overflow-hidden bg-[linear-gradient(160deg,#dff1ff_0%,#eaf3ff_48%,#b6d9ff_100%)] px-8 py-10 lg:min-h-[420px]">
                                    <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-white/40 blur-3xl" />
                                    <div className="absolute bottom-[-6rem] left-[-3rem] h-52 w-52 rounded-full bg-brand-blue/15 blur-3xl" />
                                    <div className="relative flex h-full items-center justify-center">
                                        <div className="relative h-60 w-60 overflow-hidden rounded-full border-[10px] border-white/80 bg-white shadow-[0_20px_45px_rgba(37,99,235,0.18)] lg:h-72 lg:w-72">
                                            <Image
                                                src={imageSrc}
                                                alt={doctor.name}
                                                fill
                                                unoptimized={shouldBypassImageOptimization(imageSrc)}
                                                className="object-cover object-top"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-10 lg:px-12">
                                    <div className="inline-flex rounded-full bg-brand-blue-soft px-4 py-2 text-sm font-semibold text-brand-blue">
                                        {doctor.specialty}
                                    </div>
                                    <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                                        {doctor.name}
                                    </h1>
                                    <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-600">
                                        {formattedProfile || tList('modalFallback')}
                                    </p>
                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <Button asChild className="rounded-full bg-brand-orange px-6 text-white hover:bg-brand-orange-dark">
                                            <Link href={`/${locale}/contact`}>{t('bookAppointment')}</Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="rounded-full border-brand-blue/20 text-brand-blue hover:bg-brand-blue-soft"
                                        >
                                            <Link href={`/${locale}/doctors`}>{t('viewAllDoctors')}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <aside className="space-y-6">
                                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-slate-950">{t('sidebarTitle')}</h2>
                                    <div className="mt-6 space-y-5 text-sm text-slate-600">
                                        <div className="flex items-start gap-3">
                                            <UserRound className="mt-0.5 h-5 w-5 text-brand-blue" />
                                            <div>
                                                <p className="font-semibold text-slate-900">{t('specialtyLabel')}</p>
                                                <p>{doctor.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="mt-0.5 h-5 w-5 text-brand-orange" />
                                            <div>
                                                <p className="font-semibold text-slate-900">{tList('experienceLabel')}</p>
                                                <p>{doctor.experience || tList('notSpecified')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Stethoscope className="mt-0.5 h-5 w-5 text-brand-blue" />
                                            <div>
                                                <p className="font-semibold text-slate-900">{tList('scheduleLabel')}</p>
                                                <div className="space-y-1.5">
                                                    {(doctor.schedule.length > 0 ? doctor.schedule : [tList('notSpecified')]).map((item) => (
                                                        <p key={item}>{item}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-slate-100 pt-6">
                                        <p className="mb-3 font-semibold text-slate-900">{tList('expertiseLabel')}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(doctor.tags.length > 0 ? doctor.tags : [tList('notSpecified')]).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-brand-orange/15 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange-dark"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {relatedDoctors.length > 0 ? (
                                    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                                        <h2 className="text-2xl font-bold text-slate-950">{t('otherDoctorsTitle')}</h2>
                                        <div className="mt-5 space-y-3">
                                            {relatedDoctors.map((item) => {
                                                const relatedImage = item.image || '/logo.png';
                                                return (
                                                    <Link
                                                        key={item.id}
                                                        href={`/${locale}/doctors/${item.id}`}
                                                        className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 transition-colors hover:border-brand-blue/20 hover:bg-brand-blue-soft/40"
                                                    >
                                                        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100">
                                                            <Image
                                                                src={relatedImage}
                                                                alt={item.name}
                                                                fill
                                                                unoptimized={shouldBypassImageOptimization(relatedImage)}
                                                                className="object-cover object-top"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                                                            <p className="truncate text-xs text-slate-500">{item.specialty}</p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-5 w-full rounded-full border-brand-blue/20 text-brand-blue hover:bg-brand-blue-soft"
                                        >
                                            <Link href={`/${locale}/doctors`}>{t('viewAllDoctors')}</Link>
                                        </Button>
                                    </div>
                                ) : null}
                            </aside>

                            <div className="space-y-6">
                                <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                                    <h2 className="text-3xl font-bold text-slate-950">{t('biographyTitle')}</h2>
                                    <div className="mt-5 space-y-5 text-lg leading-9 text-slate-600">
                                        <p className="whitespace-pre-line">{formattedBio || tList('modalFallback')}</p>
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Award className="h-6 w-6 text-brand-orange" />
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-950">{tList('extendedInfoTitle')}</h2>
                                            <p className="mt-1 text-sm text-slate-500">{tList('extendedInfoDescription')}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                                        {doctor.experienceDetails.length > 0 ? (
                                            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                                                <div className="mb-4 flex items-center gap-2">
                                                    <BriefcaseBusiness className="h-5 w-5 text-brand-blue" />
                                                    <h3 className="text-xl font-semibold text-slate-900">
                                                        {tList('experienceDetailsLabel')}
                                                    </h3>
                                                </div>
                                                <ul className="space-y-3 text-base leading-7 text-slate-600">
                                                    {doctor.experienceDetails.map((item, index) => (
                                                        <li key={`experience-${index}`} className="flex gap-3">
                                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}

                                        {doctor.educationDetails.length > 0 ? (
                                            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                                                <div className="mb-4 flex items-center gap-2">
                                                    <UserRound className="h-5 w-5 text-brand-blue" />
                                                    <h3 className="text-xl font-semibold text-slate-900">
                                                        {tList('educationDetailsLabel')}
                                                    </h3>
                                                </div>
                                                <ul className="space-y-3 text-base leading-7 text-slate-600">
                                                    {doctor.educationDetails.map((item, index) => (
                                                        <li key={`education-${index}`} className="flex gap-3">
                                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </div>

                                    {doctor.certifications.length > 0 ? (
                                        <div className="mt-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                                            <div className="mb-4 flex items-center gap-2">
                                                <Award className="h-5 w-5 text-brand-orange" />
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {tList('certificationsLabel')}
                                                </h3>
                                            </div>
                                            <ul className="grid gap-3 md:grid-cols-2">
                                                {doctor.certifications.map((item, index) => (
                                                    <li
                                                        key={`certification-${index}`}
                                                        className="rounded-2xl border border-brand-orange/15 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-700"
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="grid gap-6 xl:grid-cols-2">
                                    <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                                        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-950">
                                            <Stethoscope className="h-6 w-6 text-brand-orange" />
                                            {tList('proceduresLabel')}
                                        </h2>
                                        <div className="mt-5 space-y-3 text-base leading-7 text-slate-600">
                                            {(doctor.procedures.length > 0 ? doctor.procedures : [tList('notSpecified')]).map((item) => (
                                                <div key={item} className="flex gap-3">
                                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                                        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-950">
                                            <HeartPulse className="h-6 w-6 text-brand-blue" />
                                            {t('ctaTitle')}
                                        </h2>
                                        <p className="mt-4 text-base leading-7 text-slate-600">{t('ctaDescription')}</p>
                                        <Button asChild className="mt-6 rounded-full bg-brand-orange px-6 text-white hover:bg-brand-orange-dark">
                                            <Link href={`/${locale}/contact`}>{t('bookAppointment')}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
