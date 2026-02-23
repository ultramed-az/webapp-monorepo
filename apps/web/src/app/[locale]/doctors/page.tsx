'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, HeartPulse, Languages, Mail, MapPin, Phone, Search, Stethoscope, UserRound } from 'lucide-react';
import Image from 'next/image';
import { getDoctorById, getDoctors, type DoctorDetailItem, type DoctorListItem } from '@/lib/api';

type UiCopy = {
    badge: string;
    heading: string;
    intro: string;
    searchPlaceholder: string;
    loadingTitle: string;
    loadingDescription: string;
    fetchFailedTitle: string;
    fetchFailedDescription: string;
    retry: string;
    noResultsTitle: string;
    noResultsDescription: string;
    clearSearch: string;
    experienceLabel: string;
    profileButton: string;
    appointmentButton: string;
    modalTitle: string;
    modalFallback: string;
    roomLabel: string;
    educationLabel: string;
    contactLabel: string;
    scheduleLabel: string;
    proceduresLabel: string;
    languagesLabel: string;
    expertiseLabel: string;
    notSpecified: string;
    callButton: string;
    detailMissing: string;
    detailLoadFailed: string;
    detailRetry: string;
    detailUnavailable: string;
};

const UI_COPY: Record<'az' | 'en' | 'ru', UiCopy> = {
    az: {
        badge: 'Ultramed Komandası',
        heading: 'Peşəkar Həkimlərimiz',
        intro:
            'Tibb sahəsində aparıcı təhsil ocaqlarında ixtisaslaşmış, uzun illərin təcrübəsinə malik həkimlərimiz sizin sağlamlığınız üçün ən düzgün diaqnoz və müalicəni təklif edir.',
        searchPlaceholder: 'Həkimin adı, şöbəsi və ya xəstəlik üzrə axtarış...',
        loadingTitle: 'Həkimlər yüklənir...',
        loadingDescription: 'Məlumatlar bir neçə saniyə ərzində hazır olacaq.',
        fetchFailedTitle: 'Məlumat yüklənmədi',
        fetchFailedDescription: 'Zəhmət olmasa bir daha cəhd edin.',
        retry: 'Yenidən yoxla',
        noResultsTitle: 'Axtarışa uyğun nəticə tapılmadı',
        noResultsDescription: 'Zəhmət olmasa digər açar sözlərdən istifadə edərək yenidən yoxlayın.',
        clearSearch: 'Axtarışı Təmizlə',
        experienceLabel: 'İş təcrübəsi',
        profileButton: 'Profili',
        appointmentButton: 'Qəbul',
        modalTitle: 'Həkim Profili',
        modalFallback: 'Seçilmiş həkim üzrə detallı məlumat.',
        roomLabel: 'Otaq',
        educationLabel: 'Təhsil',
        contactLabel: 'Əlaqə',
        scheduleLabel: 'Qəbul cədvəli',
        proceduresLabel: 'Qəbul etdiyi istiqamətlər',
        languagesLabel: 'Danışdığı dillər',
        expertiseLabel: 'Ekspertiza sahələri',
        notSpecified: 'Qeyd edilməyib',
        callButton: 'Zəng et',
        detailMissing: 'Bu həkim üzrə detaylı məlumat tapılmadı.',
        detailLoadFailed: 'Detallı məlumat yüklənmədi.',
        detailRetry: 'Detalları yenilə',
        detailUnavailable: 'Bu həkim üzrə məlumat hazırda əlçatan deyil.',
    },
    en: {
        badge: 'Ultramed Team',
        heading: 'Our Medical Experts',
        intro:
            'Our doctors are trained in leading institutions and bring years of clinical experience to provide accurate diagnosis and effective treatment plans.',
        searchPlaceholder: 'Search by doctor name, specialty, or condition...',
        loadingTitle: 'Loading doctors...',
        loadingDescription: 'Doctor data will be ready in a few seconds.',
        fetchFailedTitle: 'Failed to load doctors',
        fetchFailedDescription: 'Please try again.',
        retry: 'Retry',
        noResultsTitle: 'No matching doctors found',
        noResultsDescription: 'Try another keyword or clear your search.',
        clearSearch: 'Clear Search',
        experienceLabel: 'Experience',
        profileButton: 'Profile',
        appointmentButton: 'Appointment',
        modalTitle: 'Doctor Profile',
        modalFallback: 'Detailed information about the selected doctor.',
        roomLabel: 'Room',
        educationLabel: 'Education',
        contactLabel: 'Contact',
        scheduleLabel: 'Consultation schedule',
        proceduresLabel: 'Consultation focus',
        languagesLabel: 'Languages',
        expertiseLabel: 'Expertise',
        notSpecified: 'Not specified',
        callButton: 'Call',
        detailMissing: 'Detailed profile for this doctor was not found.',
        detailLoadFailed: 'Failed to load detailed profile.',
        detailRetry: 'Retry details',
        detailUnavailable: 'Doctor details are currently unavailable.',
    },
    ru: {
        badge: 'Команда Ultramed',
        heading: 'Наши Врачи',
        intro:
            'Наши специалисты прошли подготовку в ведущих медицинских школах и имеют многолетний практический опыт для точной диагностики и эффективного лечения.',
        searchPlaceholder: 'Поиск по имени врача, отделению или заболеванию...',
        loadingTitle: 'Загрузка врачей...',
        loadingDescription: 'Данные будут готовы через несколько секунд.',
        fetchFailedTitle: 'Не удалось загрузить данные',
        fetchFailedDescription: 'Пожалуйста, попробуйте снова.',
        retry: 'Повторить',
        noResultsTitle: 'По вашему запросу ничего не найдено',
        noResultsDescription: 'Используйте другой запрос или очистите фильтр.',
        clearSearch: 'Очистить поиск',
        experienceLabel: 'Стаж',
        profileButton: 'Профиль',
        appointmentButton: 'Записаться',
        modalTitle: 'Профиль Врача',
        modalFallback: 'Подробная информация о выбранном враче.',
        roomLabel: 'Кабинет',
        educationLabel: 'Образование',
        contactLabel: 'Контакты',
        scheduleLabel: 'График приема',
        proceduresLabel: 'Основные направления',
        languagesLabel: 'Языки',
        expertiseLabel: 'Экспертиза',
        notSpecified: 'Не указано',
        callButton: 'Позвонить',
        detailMissing: 'Подробная информация по этому врачу не найдена.',
        detailLoadFailed: 'Не удалось загрузить подробную информацию.',
        detailRetry: 'Обновить данные',
        detailUnavailable: 'Информация по этому врачу сейчас недоступна.',
    },
};

function normalizeLocale(localeRaw: string | undefined): 'az' | 'en' | 'ru' {
    if (localeRaw === 'en' || localeRaw === 'ru') {
        return localeRaw;
    }
    return 'az';
}

export default function DoctorsPage() {
    const params = useParams<{ locale: string }>();
    const locale = normalizeLocale(params?.locale);
    const copy = UI_COPY[locale];

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

            try {
                const data = await getDoctors(locale);
                if (!isCancelled) {
                    setDoctors(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    const message = fetchError instanceof Error ? fetchError.message : copy.fetchFailedDescription;
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
    }, [copy.fetchFailedDescription, locale, refreshKey]);

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
                setProfileError(copy.detailMissing);
                return;
            }

            setDoctorDetailsById((current) => ({
                ...current,
                [doctorId]: detail,
            }));
        } catch (fetchError) {
            const message = fetchError instanceof Error ? fetchError.message : copy.detailLoadFailed;
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

    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-brand-blue-soft/80 backdrop-blur border border-brand-blue-soft text-brand-blue font-medium px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
                        <HeartPulse className="h-4 w-4" />
                        <span>{copy.badge}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{copy.heading}</h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">{copy.intro}</p>

                    <div className="mt-10 max-w-md mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder={copy.searchPlaceholder}
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
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{copy.loadingTitle}</h3>
                            <p className="text-slate-500">{copy.loadingDescription}</p>
                        </div>
                    ) : error && doctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{copy.fetchFailedTitle}</h3>
                            <p className="text-slate-500 mb-6">{copy.fetchFailedDescription}</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                {copy.retry}
                            </Button>
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{copy.noResultsTitle}</h3>
                            <p className="text-slate-500">{copy.noResultsDescription}</p>
                            <Button
                                variant="outline"
                                className="mt-6 border-slate-200 text-slate-700"
                                onClick={() => setSearchQuery('')}
                            >
                                {copy.clearSearch}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDoctors.map((doctor) => (
                                <Card key={doctor.id} className="overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col bg-white rounded-2xl">
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <Image
                                            src={doctor.image || '/logo.png'}
                                            alt={doctor.name}
                                            fill
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
                                                    {copy.experienceLabel}: <span className="font-semibold text-slate-900">{doctor.experience}</span>
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
                                                {copy.profileButton}
                                            </Button>
                                            <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm">
                                                <Link href={`/${locale}/contact`}>{copy.appointmentButton}</Link>
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto p-0 gap-0">
                    {(selectedDoctorDetail || selectedDoctor) && (
                        <div className="relative h-64 w-full bg-slate-100">
                            <Image
                                src={selectedDoctorDetail?.image ?? selectedDoctor?.image ?? '/logo.png'}
                                alt={selectedDoctorDetail?.name ?? selectedDoctor?.name ?? 'Doctor'}
                                fill
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
                            <DialogTitle className="text-2xl text-slate-900">{copy.modalTitle}</DialogTitle>
                            <DialogDescription className="text-base text-slate-600">
                                {selectedDoctorDetail?.bio ?? selectedDoctor?.bio ?? copy.modalFallback}
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
                                    {copy.detailRetry}
                                </Button>
                            </div>
                        ) : selectedDoctorDetail ? (
                            <div className="space-y-6">
                                <p className="text-slate-700 leading-relaxed">{selectedDoctorDetail.profile || selectedDoctorDetail.bio}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{copy.experienceLabel}</span>
                                        </div>
                                        <p className="font-semibold text-slate-900">{selectedDoctorDetail.experience || copy.notSpecified}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{copy.roomLabel}</span>
                                        </div>
                                        <p className="font-semibold text-slate-900">{selectedDoctorDetail.room || copy.notSpecified}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <UserRound className="h-4 w-4" />
                                            <span>{copy.educationLabel}</span>
                                        </div>
                                        <p className="font-semibold text-slate-900">{selectedDoctorDetail.education || copy.notSpecified}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-1">
                                            <Phone className="h-4 w-4" />
                                            <span>{copy.contactLabel}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-slate-900">{selectedDoctorDetail.phone || copy.notSpecified}</p>
                                            <p className="text-sm text-slate-600">{selectedDoctorDetail.email || copy.notSpecified}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-brand-blue" />
                                            {copy.scheduleLabel}
                                        </h4>
                                        <ul className="space-y-2">
                                            {(selectedDoctorDetail.schedule.length > 0
                                                ? selectedDoctorDetail.schedule
                                                : [copy.notSpecified]
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
                                            {copy.proceduresLabel}
                                        </h4>
                                        <ul className="space-y-2">
                                            {(selectedDoctorDetail.procedures.length > 0
                                                ? selectedDoctorDetail.procedures
                                                : [copy.notSpecified]
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
                                            {copy.languagesLabel}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedDoctorDetail.languages.length > 0
                                                ? selectedDoctorDetail.languages
                                                : [copy.notSpecified]
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
                                            {copy.expertiseLabel}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedDoctorDetail.tags.length > 0 ? selectedDoctorDetail.tags : [copy.notSpecified]).map(
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
                                        <Link href={`/${locale}/contact`}>{copy.appointmentButton}</Link>
                                    </Button>
                                    {phoneHref && (
                                        <Button asChild variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft">
                                            <a href={phoneHref}>
                                                <Phone className="h-4 w-4 mr-2" />
                                                {copy.callButton}
                                            </a>
                                        </Button>
                                    )}
                                    {selectedDoctorDetail.email && (
                                        <Button asChild variant="outline" className="border-slate-200 text-slate-700">
                                            <a href={`mailto:${selectedDoctorDetail.email}`}>
                                                <Mail className="h-4 w-4 mr-2" />
                                                Email
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600">{copy.detailUnavailable}</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
