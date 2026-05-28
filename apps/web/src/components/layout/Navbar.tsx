'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Facebook, Instagram, Linkedin, MapPin, Menu, Phone } from 'lucide-react';
import Image from 'next/image';
import { getContactInfo, type ContactInfoResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function isWhatsAppValue(value: string): boolean {
    return value.toLowerCase().includes('wa.me');
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M16.1 2.25c.35 2.46 1.77 4.17 4.12 4.33v3.07a7.17 7.17 0 0 1-4.02-1.25v6.09c0 3.05-2.13 5.26-5.2 5.26-2.83 0-5.22-2.2-5.22-5.04 0-3.36 3.22-5.83 6.46-4.83v3.21a2.16 2.16 0 0 0-1.14-.31 1.94 1.94 0 1 0 1.92 1.94V2.25h3.08Z" />
        </svg>
    );
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12.03 2.25a9.64 9.64 0 0 0-8.22 14.7l-1.06 4.02 4.12-1.02a9.65 9.65 0 1 0 5.16-17.7Zm0 1.75a7.9 7.9 0 0 1 6.75 12.01 7.89 7.89 0 0 1-10.95 2.32l-.35-.21-2.26.56.58-2.18-.24-.37A7.9 7.9 0 0 1 12.03 4Zm-3.19 3.96c-.17 0-.43.06-.66.31-.23.25-.87.86-.87 2.08 0 1.23.9 2.42 1.03 2.59.13.16 1.75 2.79 4.34 3.8 2.15.84 2.59.67 3.05.63.47-.04 1.51-.62 1.72-1.21.21-.59.21-1.1.15-1.21-.06-.1-.23-.16-.48-.29-.25-.12-1.51-.74-1.74-.83-.23-.08-.4-.12-.57.12-.17.25-.65.83-.8 1-.15.16-.29.18-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.38-.78-1.88-.2-.49-.41-.42-.57-.43h-.6Z" />
        </svg>
    );
}

const socialLinks = [
    { label: 'Facebook', href: '#', Icon: Facebook },
    { label: 'Instagram', href: 'https://www.instagram.com/ultramed_clinic', Icon: Instagram },
    { label: 'LinkedIn', href: '#', Icon: Linkedin },
    { label: 'TikTok', href: 'https://www.tiktok.com/@ultramed_clinic', Icon: TikTokIcon },
];

function SocialLinks({
    className,
    linkClassName,
    whatsappHref,
}: {
    className?: string;
    linkClassName?: string;
    whatsappHref?: string | null;
}) {
    const links = whatsappHref
        ? [...socialLinks, { label: 'WhatsApp', href: whatsappHref, Icon: WhatsAppIcon }]
        : socialLinks;

    return (
        <div className={`flex items-center gap-2 ${className ?? ''}`}>
            {links.map(({ label, href, Icon }) => (
                <a
                    key={label}
                    href={href}
                    target={href === '#' ? undefined : '_blank'}
                    rel={href === '#' ? undefined : 'noreferrer'}
                    aria-label={label}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${linkClassName ?? ''}`}
                >
                    <Icon className="h-4 w-4" />
                </a>
            ))}
        </div>
    );
}

export default function Navbar() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();

    const locale = params.locale as string;
    const [isScrolled, setIsScrolled] = useState(false);
    const fallbackContactInfo = useMemo<ContactInfoResponse>(
        () => ({
            address: t('addressLine'),
            map: {
                latitude: 40.3763297,
                longitude: 49.9628667,
                embedUrl: 'https://maps.google.com/maps?q=N%C9%99sr%C9%99ddin%20Tusi%2055%20Baku&z=15&output=embed',
            },
            phones: [
                { label: t('callUs'), value: '055/070-223-58-56' },
                { label: t('whatsapp'), value: 'https://wa.me/994552235856' },
            ],
            emails: [{ label: 'Email', value: 'ultramedclinics@gmail.com' }],
            workingHours: [],
        }),
        [t],
    );
    const [contactInfo, setContactInfo] = useState<ContactInfoResponse>(fallbackContactInfo);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function loadContactInfo() {
            setContactInfo(fallbackContactInfo);
            try {
                const data = await getContactInfo(locale);
                if (!isCancelled) {
                    setContactInfo(data);
                }
            } catch {
                // Keep default contact info if API is unavailable.
            }
        }

        void loadContactInfo();

        return () => {
            isCancelled = true;
        };
    }, [fallbackContactInfo, locale]);

    const languages = [
        { code: 'az', label: 'AZ' },
        { code: 'en', label: 'EN' },
        { code: 'ru', label: 'RU' }
    ];

    const currentLanguage = languages.find(l => l.code === locale) || languages[0];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const primaryPhone = useMemo(() => {
        const phone = contactInfo.phones.find((item) => !isWhatsAppValue(item.value)) ?? contactInfo.phones[0];
        return phone?.value ?? '';
    }, [contactInfo.phones]);

    const whatsappLink = useMemo(() => {
        const whatsapp = contactInfo.phones.find(
            (item) => isWhatsAppValue(item.value) || item.label.toLowerCase().includes('whatsapp'),
        );
        if (!whatsapp?.value) {
            return null;
        }

        return whatsapp.value.startsWith('http') ? whatsapp.value : `https://${whatsapp.value}`;
    }, [contactInfo.phones]);

    const navLinks = [
        { href: '/', label: t('home', { default: 'Home' }) },
        { href: '/about', label: t('about', { default: 'About' }) },
        { href: '/services', label: t('services', { default: 'Services' }) },
        { href: '/doctors', label: t('doctors', { default: 'Doctors' }) },
        { href: '/blog', label: t('blog', { default: 'Blog' }) },
        { href: '/testimonials', label: t('testimonials', { default: 'Testimonials' }) },
        { href: '/faq', label: t('faq', { default: 'FAQ' }) },
        { href: '/contact', label: t('contact', { default: 'Contact' }) },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header className="fixed top-0 w-full z-50">
            {/* Top Bar - Hidden on Mobile */}
            <div className="hidden lg:flex justify-between items-center bg-brand-blue-dark text-white/90 text-sm py-2 px-8">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${primaryPhone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">
                            {t('callUs', { default: 'Bizə zəng edin:' })} {primaryPhone}
                        </a>
                    </div>
                    <div className="flex items-center min-w-0">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate max-w-[520px]">{contactInfo.address}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <SocialLinks
                        whatsappHref={whatsappLink}
                        linkClassName="text-white/80 hover:bg-white/10 hover:text-white"
                    />
                    <span className="cursor-pointer hover:text-white transition-colors">{t('emergency', { default: 'Təcili Yardım: 103' })}</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 px-2 text-white/90 hover:text-white hover:bg-brand-blue transition-colors focus-visible:ring-0">
                                {currentLanguage.label}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {languages.map((l) => (
                                <DropdownMenuItem
                                    key={l.code}
                                    onClick={() => router.replace(pathname, { locale: l.code })}
                                    className="cursor-pointer"
                                >
                                    {l.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-5'} px-4 md:px-8 border-b border-brand-blue-soft`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    {/* Logo */}
                    <Link href="/" className="group">
                        <Image
                            src="/logo.png"
                            alt="Ultramed"
                            width={150}
                            height={150}
                            priority
                            className="transition-opacity group-hover:opacity-90"
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[15px] font-medium transition-colors hover:text-brand-orange ${isActive(link.href) ? 'text-brand-orange' : 'text-slate-700'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Button asChild className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-full px-6">
                            <Link href="/contact">
                                {t('bookAppointment', { default: 'Qəbul yazılmaq' })}
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-600">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[92vw] max-w-[360px] border-l border-slate-200 p-0 sm:max-w-[400px]">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Mobil menyu</SheetTitle>
                                </SheetHeader>
                                <div className="flex h-full flex-col">
                                    <div className="border-b border-slate-100 px-5 py-5">
                                        <Image
                                            src="/logo.png"
                                            alt="Ultramed"
                                            width={124}
                                            height={42}
                                            className="h-10 w-auto"
                                        />
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-5 py-5">
                                        <div className="flex flex-col space-y-1">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`rounded-lg px-2 py-2 text-base font-medium transition-colors hover:bg-slate-50 hover:text-brand-orange ${isActive(link.href) ? 'text-brand-orange' : 'text-slate-700'}`}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <SocialLinks
                                            whatsappHref={whatsappLink}
                                            className="mt-4 justify-start gap-3 border-t border-slate-100 pt-4"
                                            linkClassName="h-9 w-9 border border-slate-200 bg-white text-slate-600 hover:border-brand-orange/40 hover:bg-brand-orange/10 hover:text-brand-orange"
                                        />
                                    </div>

                                    <div className="mt-auto border-t border-slate-100 px-5 py-5">
                                        <div className="grid grid-cols-3 gap-2">
                                            {languages.map((l) => (
                                                <Button
                                                    key={l.code}
                                                    variant={locale === l.code ? "default" : "outline"}
                                                    onClick={() => {
                                                        router.replace(pathname, { locale: l.code });
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className="w-full"
                                                >
                                                    {l.label}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button asChild className="mt-3 w-full bg-brand-orange hover:bg-brand-orange-dark text-white">
                                            <Link href="/contact">
                                                {t('bookAppointment', { default: 'Qəbul yazılmaq' })}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
}
