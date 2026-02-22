'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Menu, Phone, HeartPulse, Search, MapPin } from 'lucide-react';

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

export default function Navbar() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();

    const locale = params.locale as string;
    const [isScrolled, setIsScrolled] = useState(false);

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

    const languages = [
        { code: 'az', label: 'AZ' },
        { code: 'en', label: 'EN' },
        { code: 'ru', label: 'RU' }
    ];

    const currentLanguage = languages.find(l => l.code === locale) || languages[0];

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
            <div className="hidden lg:flex justify-between items-center bg-blue-900 text-white/90 text-sm py-2 px-8">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{t('callUs', { default: 'Bizə zəng edin:' })} +994 12 345 67 89</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{t('addressLine', { default: 'Bakı şəhəri, Heydər Əliyev pr. 125' })}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="cursor-pointer hover:text-white transition-colors">{t('emergency', { default: 'Təcili Yardım: 103' })}</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 px-2 text-white/90 hover:text-white hover:bg-blue-800 transition-colors focus-visible:ring-0">
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
            <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-5'} px-4 md:px-8 border-b`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <HeartPulse className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-slate-800 tracking-tight">
                            Ultra<span className="text-blue-600">med</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[15px] font-medium transition-colors hover:text-blue-600 ${isActive(link.href) ? 'text-blue-600' : 'text-slate-600'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-600">
                            <Search className="w-5 h-5" />
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                            {t('bookAppointment', { default: 'Qəbul yazılmaq' })}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-600">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col h-full mt-8">
                                    <div className="flex flex-col space-y-4">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`text-lg font-medium transition-colors hover:text-blue-600 ${isActive(link.href) ? 'text-blue-600' : 'text-slate-600'}`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-8 border-t pt-8 flex flex-col space-y-4">
                                        <div className="flex gap-2">
                                            {languages.map((l) => (
                                                <Button
                                                    key={l.code}
                                                    variant={locale === l.code ? "default" : "outline"}
                                                    onClick={() => router.replace(pathname, { locale: l.code })}
                                                    className="w-full"
                                                >
                                                    {l.label}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            {t('bookAppointment', { default: 'Qəbul yazılmaq' })}
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
