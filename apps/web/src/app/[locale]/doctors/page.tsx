'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, HeartPulse, Languages, Mail, MapPin, Phone, Search, Stethoscope, UserRound } from 'lucide-react';
import Image from 'next/image';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getDoctorById, getDoctors, isBackendUnavailableError, type DoctorDetailItem, type DoctorListItem } from '@/lib/api';
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

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [doctorDetailsById, setDoctorDetailsById] = useState<Record<string, DoctorDetailItem>>({});
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

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
                if (!isCancelled) {
                    if (isBackendUnavailableError(fetchError)) {
                        setIsUnavailable(true);
                        return;
                    }
                    const message = fetchError instanceof Error ? fetchError.message : t('fetchFailedDescription');
                    setError(message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        setDoctorDetailsById({});
        setSelectedDoctorId(null);
        setProfileError(null);
        setIsProfileLoading(false);
        setIsProfileModalOpen(false);
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
                tagMatch
            );
        });
    }, [doctors, searchQuery]);

    const selectedDoctor = useMemo(
        () => doctors.find((doctor) => doctor.id === selectedDoctorId) ?? null,
        [doctors, selectedDoctorId],
    );

    const selectedDoctorDetail = useMemo(
        () => (selectedDoctorId ? doctorDetailsById[selectedDoctorId] : null),
        [doctorDetailsById, selectedDoctorId],
    );
    const selectedDoctorImageSrc = selectedDoctorDetail?.image ?? selectedDoctor?.image ?? '/logo.png';

    const phoneHref = useMemo(() => {
        if (!selectedDoctorDetail?.phone) {
            return null;
        }
        return `tel:${selectedDoctorDetail.phone.replace(/\s+/g, '')}`;
    }, [selectedDoctorDetail?.phone]);

    const openProfileModal = async (doctorId: string) => {
        setSelectedDoctorId(doctorId);
        setIsProfileModalOpen(true);
        setProfileError(null);

        if (doctorDetailsById[doctorId]) {
            setIsProfileLoading(false);
            return;
        }

        setIsProfileLoading(true);
        try {
            const detail = await getDoctorById(doctorId, locale);
            if (!detail) {
                setProfileError(t('detailMissing'));
                return;
            }

            setDoctorDetailsById((current) => ({
                ...current,
                [doctorId]: detail,
            }));
        } catch (fetchError) {
            const message = fetchError instanceof Error ? fetchError.message : t('detailLoadFailed');
            setProfileError(message);
        } finally {
            setIsProfileLoading(false);
        }
    };

    const retrySelectedDoctorDetail = async () => {
        if (!selectedDoctorId) {
            return;
        }

        await openProfileModal(selectedDoctorId);
    };

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
        <div className="flex flex-col min-h-screen">
            <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-brand-blue-soft/80 backdrop-blur border border-brand-blue-soft text-brand-blue font-medium px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
                        <HeartPulse className="h-4 w-4" />
                        <span>{t('badge')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{t('heading')}</h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">{t('intro')}</p>

                    <div className="mt-10 max-w-md mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="pl-12 pr-4 py-6 w-full rounded-2xl border-slate-200 shadow-sm focus-visible:ring-brand-blue focus-visible:ring-offset-2 text-[15px] transition-shadow"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white flex-grow border-t border-slate-100">
                <div className="container mx-auto px-6">
                    {isLoading && doctors.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Card key={index} className="overflow-hidden border-slate-100 bg-white rounded-2xl">
                                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                    <CardContent className="space-y-3 pt-6">
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </CardContent>
                                    <CardFooter className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50/70">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : error && doctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('fetchFailedTitle')}</h3>
                            <p className="text-slate-500 mb-6">{t('fetchFailedDescription')}</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                {t('retry')}
                            </Button>
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('noResultsTitle')}</h3>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDoctors.map((doctor) => {
                                const imageSrc = doctor.image || '/logo.png';
                                return (
                                <Card key={doctor.id} className="overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col bg-white rounded-2xl">
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <Image
                                            src={imageSrc}
                                            alt={doctor.name}
                                            fill
                                            unoptimized={shouldBypassImageOptimization(imageSrc)}
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <div className="absolute max-w-full bottom-0 left-0 p-6 w-full">
                                            <div className="inline-block bg-brand-blue text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                                                {doctor.specialty}
                                            </div>
                                            <h3 className="text-xl font-bold text-white truncate max-w-full block" title={doctor.name}>{doctor.name}</h3>
                                        </div>
                                    </div>
                                    <CardContent className="pt-6 pb-2 px-6 flex-grow">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <MapPin className="w-5 h-5 text-brand-blue mr-3 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-700 leading-relaxed font-medium">{doctor.education}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Calendar className="w-5 h-5 text-brand-orange mr-3 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-600">
                                                    {t('experienceLabel')}: <span className="font-semibold text-slate-900">{doctor.experience}</span>
                                                </span>
                                            </li>
                                        </ul>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {doctor.tags.map((tag) => (
                                                <span key={tag} className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-6 py-5 border-t border-slate-50 mt-auto bg-slate-50/50">
                                        <div className="grid grid-cols-2 gap-3 w-full">
                                            <Button
                                                variant="outline"
                                                className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900"
                                                onClick={() => void openProfileModal(doctor.id)}
                                            >
                                                {t('profileButton')}
                                            </Button>
                                            <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm">
                                                <Link href={`/${locale}/contact`}>{t('appointmentButton')}</Link>
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto p-0 gap-0">
                    {(selectedDoctorDetail || selectedDoctor) && (
                        <div className="relative h-64 w-full bg-slate-100">
                            <Image
                                src={selectedDoctorImageSrc}
                                alt={selectedDoctorDetail?.name ?? selectedDoctor?.name ?? t('doctorAlt')}
                                fill
                                unoptimized={shouldBypassImageOptimization(selectedDoctorImageSrc)}
                                className="object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-sm uppercase tracking-[0.2em] text-white/80 mb-2">
                                    {selectedDoctorDetail?.specialty ?? selectedDoctor?.specialty}
                                </p>
                                <h2 className="text-3xl font-extrabold tracking-tight">
                                    {selectedDoctorDetail?.name ?? selectedDoctor?.name}
                                </h2>
                            </div>
                        </div>
                    )}

                    <div className="p-6 space-y-6">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-2xl text-slate-900">{t('modalTitle')}</DialogTitle>
                            <DialogDescription className="text-base text-slate-600">
                                {selectedDoctorDetail?.bio ?? selectedDoctor?.bio ?? t('modalFallback')}
                            </DialogDescription>
                        </DialogHeader>

                        {isProfileLoading ? (
                            <div className="space-y-3 py-2">
                                <div className="h-4 w-full rounded bg-slate-100"></div>
                                <div className="h-4 w-[95%] rounded bg-slate-100"></div>
                                <div className="h-4 w-[82%] rounded bg-slate-100"></div>
                            </div>
                        ) : profileError ? (
                            <div className="rounded-lg border border-brand-orange/20 bg-brand-orange/10 p-4">
                                <p className="text-brand-orange-dark mb-4">{profileError}</p>
                                <Button
                                    variant="outline"
                                    className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                    onClick={() => void retrySelectedDoctorDetail()}
                                >
                                    {t('detailRetry')}
                                </Button>
                            </div>
                        ) : selectedDoctorDetail ? (
                            <div className="space-y-6">
                                <p className="text-slate-700 leading-relaxed">{selectedDoctorDetail.profile || selectedDoctorDetail.bio}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{t('experienceLabel')}</span>
                                        </div>
                                        <p className="font-semibold text-slate-900">{selectedDoctorDetail.experience || t('notSpecified')}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{t('roomLabel')}</span>
                                        </div>
                                        <p className="font-semibold text-slate-900">{selectedDoctorDetail.room || t('notSpecified')}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <UserRound className="h-4 w-4" />
                                            <span>{t('educationLabel')}</span>
                                        </div>
                                        <p className="font-semibold text-slate-900">{selectedDoctorDetail.education || t('notSpecified')}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <Phone className="h-4 w-4" />
                                            <span>{t('contactLabel')}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-slate-900">{selectedDoctorDetail.phone || t('notSpecified')}</p>
                                            <p className="text-sm text-slate-600">{selectedDoctorDetail.email || t('notSpecified')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-brand-blue" />
                                            {t('scheduleLabel')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {(selectedDoctorDetail.schedule.length > 0
                                                ? selectedDoctorDetail.schedule
                                                : [t('notSpecified')]
                                            ).map((item) => (
                                                <li key={item} className="text-sm text-slate-700">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4 text-brand-orange" />
                                            {t('proceduresLabel')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {(selectedDoctorDetail.procedures.length > 0
                                                ? selectedDoctorDetail.procedures
                                                : [t('notSpecified')]
                                            ).map((item) => (
                                                <li key={item} className="text-sm text-slate-700">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <Languages className="h-4 w-4 text-brand-blue" />
                                            {t('languagesLabel')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedDoctorDetail.languages.length > 0
                                                ? selectedDoctorDetail.languages
                                                : [t('notSpecified')]
                                            ).map((language) => (
                                                <span
                                                    key={language}
                                                    className="rounded-full border border-brand-blue/20 bg-brand-blue-soft px-3 py-1 text-xs font-semibold text-brand-blue"
                                                >
                                                    {language}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <HeartPulse className="h-4 w-4 text-brand-orange" />
                                            {t('expertiseLabel')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedDoctorDetail.tags.length > 0 ? selectedDoctorDetail.tags : [t('notSpecified')]).map(
                                                (tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange-dark"
                                                    >
                                                        {tag}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-1">
                                    <Button asChild className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                                        <Link href={`/${locale}/contact`}>{t('appointmentButton')}</Link>
                                    </Button>
                                    {phoneHref && (
                                        <Button asChild variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft">
                                            <a href={phoneHref}>
                                                <Phone className="h-4 w-4 mr-2" />
                                                {t('callButton')}
                                            </a>
                                        </Button>
                                    )}
                                    {selectedDoctorDetail.email && (
                                        <Button asChild variant="outline" className="border-slate-200 text-slate-700">
                                            <a href={`mailto:${selectedDoctorDetail.email}`}>
                                                <Mail className="h-4 w-4 mr-2" />
                                                {t('emailButton')}
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600">{t('detailUnavailable')}</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
