'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Menu, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { getContactInfo, type ContactInfoResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
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
        { href: '/gallery', label: t('gallery', { default: 'Gallery' }) },
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
                    {whatsappLink && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            {t('whatsapp')}
                        </a>
                    )}
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
