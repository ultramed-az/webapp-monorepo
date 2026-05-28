'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HeartPulse, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getDoctors, isBackendUnavailableError, type DoctorListItem } from '@/lib/api';
import { shouldBypassImageOptimization } from '@/lib/image';

function normalizeLocale(localeRaw: string | undefined): 'az' | 'en' | 'ru' {
    if (localeRaw === 'en' || localeRaw === 'ru') {
        return localeRaw;
    }

    return 'az';
}

export default function DoctorsPage() {
    const params = useParams<{ locale: string }>();
    const locale = normalizeLocale(params?.locale);
    const t = useTranslations('DoctorsPage');

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [doctors, setDoctors] = useState<DoctorListItem[]>([]);

    useEffect(() => {
        let isCancelled = false;

        async function loadDoctors() {
            setIsLoading(true);
            setError(null);
            setIsUnavailable(false);

            try {
                const data = await getDoctors(locale);
                if (!isCancelled) {
                    setDoctors(data);
                }
            } catch (fetchError) {
                if (isCancelled) {
                    return;
                }

                if (isBackendUnavailableError(fetchError)) {
                    setIsUnavailable(true);
                    return;
                }

                const message = fetchError instanceof Error ? fetchError.message : t('fetchFailedDescription');
                setError(message);
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadDoctors();

        return () => {
            isCancelled = true;
        };
    }, [locale, refreshKey, t]);

    const filteredDoctors = useMemo(() => {
        const needle = searchQuery.trim().toLowerCase();
        if (!needle) {
            return doctors;
        }

        return doctors.filter((doctor) => {
            const tagMatch = doctor.tags.some((tag) => tag.toLowerCase().includes(needle));
            return (
                doctor.name.toLowerCase().includes(needle) ||
                doctor.specialty.toLowerCase().includes(needle) ||
                doctor.education.toLowerCase().includes(needle) ||
                doctor.bio.toLowerCase().includes(needle) ||
                tagMatch
            );
        });
    }, [doctors, searchQuery]);

    if (isUnavailable && doctors.length === 0) {
        return (
            <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
                <div className="container mx-auto max-w-4xl">
                    <TemporaryUnavailable onRetry={() => setRefreshKey((key) => key + 1)} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <section className="relative overflow-hidden bg-brand-cream py-16 lg:py-24">
                <div className="pointer-events-none absolute left-[-8rem] top-10 h-60 w-60 rounded-full bg-brand-blue-soft/60 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-[-5rem] h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-brand-blue-soft bg-brand-blue-soft/80 px-4 py-2 text-sm font-medium text-brand-blue shadow-sm backdrop-blur">
                        <HeartPulse className="h-4 w-4" />
                        <span>{t('badge')}</span>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                        {t('heading')}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                        {t('intro')}
                    </p>

                    <div className="group relative mx-auto mt-10 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <Search className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-blue" />
                        </div>
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full rounded-2xl border-slate-200 py-6 pl-12 pr-4 text-[15px] shadow-sm transition-shadow focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-100 bg-white py-20">
                <div className="container mx-auto px-6">
                    {isLoading && doctors.length === 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="overflow-hidden rounded-md border border-slate-100 shadow-sm">
                                    <Skeleton className="aspect-[4/5] w-full" />
                                </div>
                            ))}
                        </div>
                    ) : error && doctors.length === 0 ? (
                        <div className="rounded-3xl border border-slate-100 bg-slate-50 py-20 text-center">
                            <h3 className="mb-2 text-xl font-semibold text-slate-900">{t('fetchFailedTitle')}</h3>
                            <p className="mb-6 text-slate-500">{error}</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                {t('retry')}
                            </Button>
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="rounded-3xl border border-slate-100 bg-slate-50 py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-slate-900">{t('noResultsTitle')}</h3>
                            <p className="text-slate-500">{t('noResultsDescription')}</p>
                            <Button
                                variant="outline"
                                className="mt-6 border-slate-200 text-slate-700"
                                onClick={() => setSearchQuery('')}
                            >
                                {t('clearSearch')}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {filteredDoctors.map((doctor) => {
                                const imageSrc = doctor.image || '/logo.png';

                                return (
                                    <Link
                                        key={doctor.id}
                                        href={`/${locale}/doctors/${doctor.id}`}
                                        className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4"
                                    >
                                        <article className="relative aspect-[4/5] overflow-hidden rounded-md bg-slate-200 shadow-[0_18px_46px_rgba(15,23,42,0.10)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                                            <Image
                                                src={imageSrc}
                                                alt={doctor.name}
                                                fill
                                                unoptimized={shouldBypassImageOptimization(imageSrc)}
                                                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-slate-950/70 via-slate-900/35 to-transparent" />

                                            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                                                <p className="text-lg font-semibold leading-tight text-white/65 md:text-xl">
                                                    {doctor.specialty}
                                                </p>
                                                <h3 className="mt-4 max-w-[92%] break-words text-[1.7rem] font-black leading-[1.05] tracking-normal md:text-[2rem] lg:text-[2.15rem]">
                                                    {doctor.name}
                                                </h3>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
