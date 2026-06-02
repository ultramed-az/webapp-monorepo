'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Baby,
    Brain,
    ClipboardList,
    Clock,
    HeartPulse,
    MapPin,
    Microscope,
    Phone,
    ShieldCheck,
    Stethoscope,
    Syringe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { Link } from '@/i18n/routing';
import {
    getBlogPosts,
    getCheckupPackages,
    getContactInfo,
    getDoctors,
    getHomeStats,
    getServices,
    isBackendUnavailableError,
    type BlogListItem,
    type CheckupPackageItem,
    type ContactInfoResponse,
    type DoctorListItem,
    type HomeStatItem,
    type ServiceListItem,
} from '@/lib/api';
import { shouldBypassImageOptimization } from '@/lib/image';

type Locale = 'az' | 'en' | 'ru';

function normalizeLocale(localeRaw: string | undefined): Locale {
    if (localeRaw === 'en' || localeRaw === 'ru') return localeRaw;
    return 'az';
}

const fallbackDoctors: DoctorListItem[] = [
    {
        id: 'fallback-doctor-1',
        name: 'Dr. Esmira Gülmalıyeva',
        specialty: 'Terapevt',
        bio: 'Profilaktika və daxili xəstəliklər üzrə təcrübəli həkim.',
        experience: '15 il',
        education: '',
        tags: [],
        image: null,
    },
    {
        id: 'fallback-doctor-2',
        name: 'Dr. Elşən Səfərov',
        specialty: 'Uroloq-androloq',
        bio: 'Uroloji müayinələr və fərdi müalicə planları.',
        experience: '12 il',
        education: '',
        tags: [],
        image: null,
    },
    {
        id: 'fallback-doctor-3',
        name: 'Dr. Qalina Cəfərova',
        specialty: 'Pediatr',
        bio: 'Uşaq sağlamlığı və profilaktik baxım.',
        experience: '10 il',
        education: '',
        tags: [],
        image: null,
    },
];

const fallbackCheckups: CheckupPackageItem[] = [
    { id: 'fallback-checkup-1', title: 'Ginekoloji check up', subtitle: '4 May 2026', price: '64', currency: '₼' },
    { id: 'fallback-checkup-2', title: 'Yeni evlənənlər üçün check up', subtitle: '12 Aprel 2026', price: '99', currency: '₼' },
    { id: 'fallback-checkup-3', title: 'Terapevtik check up', subtitle: '12 Aprel 2026', price: '109', currency: '₼' },
];

const fallbackBlogs: BlogListItem[] = [
    {
        id: 'fallback-blog-1',
        title: 'Ginekoloji check up',
        excerpt: 'Qadın sağlamlığı üçün əsas laborator və instrumental yoxlanışlar.',
        content: '',
        author: 'Ultramed',
        category: 'Check-up',
        image: 'https://images.unsplash.com/photo-1581431886211-6b932f8367f2?q=80&w=1600&auto=format&fit=crop',
        featured: true,
        views: 0,
        date: '04 May 2026',
    },
    {
        id: 'fallback-blog-2',
        title: 'Yeni evlənənlər üçün check up',
        excerpt: 'Ailə planlaması öncəsi profilaktik müayinə paketi.',
        content: '',
        author: 'Ultramed',
        category: 'Aksiya',
        image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600&auto=format&fit=crop',
        featured: false,
        views: 0,
        date: '12 Aprel 2026',
    },
    {
        id: 'fallback-blog-3',
        title: 'Terapevtik check up',
        excerpt: 'Ümumi sağlamlıq vəziyyətini vaxtında qiymətləndirmək üçün yoxlanış.',
        content: '',
        author: 'Ultramed',
        category: 'Təklif',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
        featured: false,
        views: 0,
        date: '12 Aprel 2026',
    },
];

const fallbackContact: ContactInfoResponse = {
    address: 'Xətai rayonu Nəsrəddin Tusi 55, Ultramed Clinic',
    map: {
        latitude: 40.3763297,
        longitude: 49.9628667,
        embedUrl: 'https://maps.google.com/maps?q=N%C9%99sr%C9%99ddin%20Tusi%2055%20Baku&z=15&output=embed',
    },
    phones: [
        { label: 'Telefon', value: '055/070-223-58-56' },
        { label: 'WhatsApp', value: 'https://wa.me/994552235856' },
    ],
    emails: [{ label: 'Email', value: 'ultramedclinics@gmail.com' }],
    workingHours: [
        { label: 'Bazar ertəsi - Cümə', value: '09:00 - 19:00' },
        { label: 'Şənbə', value: '10:00 - 16:00' },
    ],
};

function serviceIcon(iconKey: string | null) {
    const className = 'h-8 w-8';
    const normalized = iconKey?.toLowerCase() ?? '';

    if (normalized.includes('brain')) return <Brain className={className} />;
    if (normalized.includes('heart')) return <HeartPulse className={className} />;
    if (normalized.includes('shield')) return <ShieldCheck className={className} />;
    if (normalized.includes('baby') || normalized.includes('pedia')) return <Baby className={className} />;
    if (normalized.includes('micro') || normalized.includes('lab')) return <Microscope className={className} />;
    if (normalized.includes('syringe')) return <Syringe className={className} />;
    return <Stethoscope className={className} />;
}

function displayed<T>(items: T[], fallback: T[], limit: number): T[] {
    const source = items.length > 0 ? items : fallback;
    return source.slice(0, limit);
}

export default function HomePage() {
    const params = useParams<{ locale: string }>();
    const locale = normalizeLocale(params?.locale);

    const [services, setServices] = useState<ServiceListItem[]>([]);
    const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
    const [blogs, setBlogs] = useState<BlogListItem[]>([]);
    const [checkups, setCheckups] = useState<CheckupPackageItem[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfoResponse>(fallbackContact);
    const [stats, setStats] = useState<HomeStatItem[]>([]);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const doctorsTrackRef = useRef<HTMLDivElement | null>(null);
    const [doctorCarouselState, setDoctorCarouselState] = useState({
        atStart: true,
        atEnd: false,
        canScroll: false,
    });

    useEffect(() => {
        let isCancelled = false;

        async function loadHomeData() {
            setIsUnavailable(false);
            const results = await Promise.allSettled([
                getServices(locale),
                getDoctors(locale),
                getBlogPosts(locale),
                getCheckupPackages(locale),
                getContactInfo(locale),
                getHomeStats(),
            ]);

            if (isCancelled) return;

            const [serviceResult, doctorResult, blogResult, checkupResult, contactResult, statResult] = results;

            if (serviceResult.status === 'fulfilled') setServices(serviceResult.value);
            if (doctorResult.status === 'fulfilled') setDoctors(doctorResult.value);
            if (blogResult.status === 'fulfilled') setBlogs(blogResult.value);
            if (checkupResult.status === 'fulfilled') setCheckups(checkupResult.value);
            if (contactResult.status === 'fulfilled') setContactInfo(contactResult.value);
            if (statResult.status === 'fulfilled') setStats(statResult.value);

            if (results.some((result) => result.status === 'rejected' && isBackendUnavailableError(result.reason))) {
                setIsUnavailable(true);
            }
        }

        void loadHomeData();

        return () => {
            isCancelled = true;
        };
    }, [locale, refreshKey]);

    const statValues = useMemo(() => {
        const values = stats.reduce<Record<string, string>>((acc, item) => {
            acc[item.id] = item.value;
            return acc;
        }, {});

        return [
            { value: values.patients ?? '15k+', label: 'Pasiyent' },
            { value: values.doctors ?? '50+', label: 'Həkim' },
            { value: '24/7', label: 'Xidmət' },
        ];
    }, [stats]);

    const homeServices = services.slice(0, 8);
    const homeDoctors = displayed(doctors, fallbackDoctors, 6);
    const homeCheckups = displayed(checkups, fallbackCheckups, 3);
    const homeBlogs = displayed(blogs, fallbackBlogs, 3);
    const primaryPhone = contactInfo.phones.find((item) => !item.value.includes('wa.me'))?.value ?? contactInfo.phones[0]?.value ?? '';
    const primaryEmail = contactInfo.emails[0]?.value ?? 'ultramedclinics@gmail.com';

    const updateDoctorCarouselState = useCallback(() => {
        const track = doctorsTrackRef.current;
        if (!track) return;

        const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
        const currentScroll = track.scrollLeft;

        setDoctorCarouselState({
            atStart: currentScroll <= 4,
            atEnd: currentScroll >= maxScroll - 4,
            canScroll: maxScroll > 4,
        });
    }, []);

    const scrollDoctors = useCallback((direction: 'previous' | 'next') => {
        const track = doctorsTrackRef.current;
        if (!track) return;

        const firstCard = track.querySelector<HTMLElement>('[data-doctor-card]');
        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || '20') || 20;
        const step = firstCard ? firstCard.offsetWidth + gap : Math.min(track.clientWidth * 0.85, 320);

        track.scrollBy({
            left: direction === 'next' ? step : -step,
            behavior: 'smooth',
        });

        window.setTimeout(updateDoctorCarouselState, 350);
    }, [updateDoctorCarouselState]);

    useEffect(() => {
        const track = doctorsTrackRef.current;
        if (!track) return;

        updateDoctorCarouselState();
        track.addEventListener('scroll', updateDoctorCarouselState, { passive: true });
        window.addEventListener('resize', updateDoctorCarouselState);

        return () => {
            track.removeEventListener('scroll', updateDoctorCarouselState);
            window.removeEventListener('resize', updateDoctorCarouselState);
        };
    }, [homeDoctors.length, updateDoctorCarouselState]);

    return (
        <div className="min-h-screen bg-white text-slate-950">
            {isUnavailable ? (
                <div className="container mx-auto px-5 pt-6">
                    <TemporaryUnavailable compact onRetry={() => setRefreshKey((key) => key + 1)} />
                </div>
            ) : null}

            <section className="bg-white px-4 pb-14 pt-5 sm:px-6 lg:pb-20">
                <div className="container mx-auto">
                    <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-blue-dark shadow-[0_28px_80px_rgba(16,55,114,0.18)]">
                        <div className="absolute inset-0">
                            <Image
                                src="/about_banner.JPG"
                                alt="Ultramed Clinic"
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,55,114,0.88),rgba(16,55,114,0.62)_44%,rgba(16,55,114,0.18))]" />
                        </div>

                        <div className="relative grid min-h-[610px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:px-12 lg:py-14">
                            <div className="max-w-2xl text-white">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-brand-blue shadow-sm">
                                    <HeartPulse className="h-4 w-4" />
                                    Ultramed Clinic
                                </div>
                                <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                    İnsani qayğı ilə müasir təbabət
                                </h1>
                                <p className="mt-5 max-w-lg text-base font-medium leading-8 text-white/90 sm:text-lg">
                                    Müasir diaqnostika, peşəkar həkim heyəti və pasiyent yönümlü xidmətlə sağlamlığınız üçün etibarlı tibbi mərkəz.
                                </p>

                                <div className="mt-7 grid max-w-lg grid-cols-3 gap-3">
                                    {statValues.map((stat, index) => (
                                        <div key={`${stat.label}-${index}`} className="rounded-2xl bg-white/12 px-3 py-3 backdrop-blur">
                                            <div className="text-xl font-black">{stat.value}</div>
                                            <div className="mt-1 text-xs font-semibold text-white/80">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild className="h-12 rounded-full bg-brand-orange px-6 text-white hover:bg-brand-orange-dark">
                                        <Link href="/contact">
                                            Qəbula yazıl
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="h-12 rounded-full bg-white px-6 text-brand-blue hover:bg-white/90">
                                        <a href={`tel:${primaryPhone.replace(/[^\d+]/g, '')}`}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            {primaryPhone}
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-[430px] lg:mx-0">
                                <div className="rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight text-slate-950">
                                                Check-up Paketləri
                                            </h2>
                                            <p className="mt-2 text-sm font-medium text-slate-500">
                                                Əlverişli qiymətlərlə sağlamlıq yoxlanışı
                                            </p>
                                        </div>
                                        <ClipboardList className="h-8 w-8 text-brand-blue" />
                                    </div>

                                    <div className="mt-5 h-px bg-brand-blue-soft" />

                                    <div className="mt-5 flex flex-col gap-3">
                                        {homeCheckups.map((item) => (
                                            <Link
                                                key={item.id}
                                                href="/contact"
                                                className="group grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_12px_30px_rgba(21,72,158,0.12)] ring-1 ring-brand-blue-soft transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(21,72,158,0.18)]"
                                            >
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-black leading-5 text-slate-950 sm:text-base">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs font-medium text-slate-500">
                                                        {item.subtitle || 'Müddətli təklif'}
                                                    </p>
                                                </div>
                                                <div className="rounded-full bg-brand-blue px-4 py-2 text-sm font-black text-white shadow-[0_10px_22px_rgba(21,72,158,0.32)]">
                                                    {item.price} {item.currency}
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-brand-blue transition group-hover:translate-x-1" />
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-6 border-t border-brand-blue-soft pt-5 text-center">
                                        <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black text-brand-blue">
                                            Bütün Check-up Paketləri
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#eefdff] px-4 py-16 sm:px-6 lg:py-20">
                <div className="container mx-auto">
                    <div className="mb-10 max-w-xl">
                        <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                            Müasir texnologiya və peşəkar xidmətlər
                        </h2>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {homeServices.map((service) => (
                            <div
                                key={service.id}
                                className="flex min-h-[150px] cursor-default flex-col justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-brand-blue-soft"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-soft text-brand-blue">
                                    {serviceIcon(service.iconKey)}
                                </div>
                                <div className="mt-7 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                                    <h3 className="text-base font-bold leading-6 text-slate-950">{service.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-4 py-16 sm:px-6 lg:py-24">
                <div className="container mx-auto grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
                    <div>
                        <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-950">
                            Həkim heyətimiz
                        </h2>
                        <p className="mt-5 text-sm leading-7 text-slate-500">
                            Peşəkar və təcrübəli həkimlərimiz sağlamlığınız üçün yüksək səviyyəli tibbi xidmət göstərirlər.
                        </p>
                        <div className="mt-7 flex gap-3">
                            <button
                                type="button"
                                data-testid="home-doctors-prev"
                                aria-label="Əvvəlki həkimləri göstər"
                                disabled={!doctorCarouselState.canScroll || doctorCarouselState.atStart}
                                onClick={() => scrollDoctors('previous')}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue-soft text-brand-blue transition hover:border-brand-blue hover:bg-brand-blue-soft disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                data-testid="home-doctors-next"
                                aria-label="Növbəti həkimləri göstər"
                                disabled={!doctorCarouselState.canScroll || doctorCarouselState.atEnd}
                                onClick={() => scrollDoctors('next')}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/20 transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div ref={doctorsTrackRef} data-testid="home-doctors-track" className="scrollbar-hide -mx-4 flex scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 lg:mx-0 lg:px-0">
                        {homeDoctors.map((doctor) => {
                            const doctorImage = doctor.image || '/logo.png';
                            return (
                                <Link
                                    key={doctor.id}
                                    href={`/doctors/${doctor.id}`}
                                    data-doctor-card
                                    className="group relative h-[330px] w-[245px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_16px_42px_rgba(15,23,42,0.12)] ring-1 ring-slate-100"
                                >
                                    <Image
                                        src={doctorImage}
                                        alt={doctor.name}
                                        fill
                                        unoptimized={shouldBypassImageOptimization(doctorImage)}
                                        sizes="245px"
                                        className="object-cover object-top"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-blue via-brand-blue/95 to-transparent p-5 pt-20 text-white">
                                        <h3 className="text-lg font-black leading-6">{doctor.name}</h3>
                                        <p className="mt-1 text-xs font-semibold text-white/80">{doctor.specialty}</p>
                                        <span className="mt-4 inline-flex rounded-full bg-brand-orange px-4 py-2 text-xs font-black text-white">
                                            Ətraflı
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white px-4 py-16 sm:px-6 lg:py-24">
                <div className="container mx-auto">
                    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight text-slate-950">
                                Xəbərlər və Aksiyalar
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                                Ən son xəbərlər, tibbi yeniliklər və xüsusi təkliflərimiz haqqında məlumat alın.
                            </p>
                        </div>
                        <Button asChild className="w-fit rounded-full bg-brand-blue px-6 text-white hover:bg-brand-blue-dark">
                            <Link href="/blog">
                                Hamısına bax
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {homeBlogs.map((post, index) => {
                            const image = post.image || '/about_banner.JPG';
                            return (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.id}`}
                                    className="group overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.10)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(21,72,158,0.16)]"
                                >
                                    <div className="relative h-48 bg-brand-blue-soft">
                                        <Image
                                            src={image}
                                            alt={post.title}
                                            fill
                                            unoptimized={shouldBypassImageOptimization(image)}
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover"
                                        />
                                        <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
                                            {index === 0 ? '64 ₼' : index === 1 ? '99 ₼' : '109 ₼'}
                                        </span>
                                        <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-blue">
                                            {post.date}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-black leading-6 text-slate-950">{post.title}</h3>
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
                                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue">
                                            Ətraflı oxu
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white px-4 pb-20 sm:px-6 lg:pb-28">
                <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                            Peşəkar məsləhət alın
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                            Bir dəqiqə ərzində qeydiyyatı tamamlayın və peşəkar həkim məsləhəti alın.
                        </p>

                        <form
                            className="mt-8 grid gap-3 rounded-2xl bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.10)] ring-1 ring-slate-100"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-blue" placeholder="Ad və Soyad" />
                                <input className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-blue" placeholder="E-mail" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-blue" placeholder="Telefon nömrəsi" />
                                <select className="h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-500 outline-none focus:border-brand-blue">
                                    <option>Xidmət seçin</option>
                                    {homeServices.slice(0, 5).map((service) => (
                                        <option key={service.id}>{service.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-blue" placeholder="Tarix seçin" />
                                <input className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-blue" placeholder="Saat seçin" />
                            </div>
                            <textarea className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-blue" placeholder="Mesajınız (istəyə görə)" />
                            <Button className="h-12 rounded-xl bg-slate-200 text-slate-500 hover:bg-brand-orange hover:text-white">
                                Qəbula yazıl
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    <div className="rounded-2xl bg-brand-blue p-7 text-white shadow-[0_24px_60px_rgba(21,72,158,0.28)]">
                        <div className="mb-8 flex justify-end">
                            <span className="rounded-full border border-white/30 px-4 py-2 text-xs font-black">ULTRAMED CLINIC</span>
                        </div>
                        <div className="grid gap-5">
                            <div className="flex gap-4 rounded-xl bg-white/10 p-4">
                                <Clock className="h-6 w-6 shrink-0 text-white" />
                                <div>
                                    <h3 className="font-black">İş saatları</h3>
                                    {contactInfo.workingHours.map((item) => (
                                        <p key={`${item.label}-${item.value}`} className="mt-1 text-sm text-white/85">
                                            {item.label}: {item.value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 rounded-xl bg-white/10 p-4">
                                <Phone className="h-6 w-6 shrink-0 text-white" />
                                <div>
                                    <h3 className="font-black">Telefon</h3>
                                    <p className="mt-1 text-sm text-white/85">{primaryPhone}</p>
                                    <p className="mt-1 text-sm text-white/85">{primaryEmail}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 rounded-xl bg-white/10 p-4">
                                <MapPin className="h-6 w-6 shrink-0 text-white" />
                                <div>
                                    <h3 className="font-black">Ünvan</h3>
                                    <p className="mt-1 text-sm leading-6 text-white/85">{contactInfo.address}</p>
                                </div>
                            </div>
                            <Button asChild className="mt-2 rounded-xl bg-white text-brand-blue hover:bg-white/90">
                                <a href={contactInfo.map.embedUrl} target="_blank" rel="noreferrer">
                                    Google Maps-də baxın
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
