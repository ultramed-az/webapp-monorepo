'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-slate-900 text-slate-200">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & About */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Ultramed</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t('description', { default: 'Sizin sağlamlığınız bizim prioritetimizdir. Müasir avadanlıqlar və peşəkar həkim kollektivi.' })}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">{t('quickLinks', { default: 'Cəld Keçid' })}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">{t('home', { default: 'Ana Səhifə' })}</Link></li>
                            <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">{t('about', { default: 'Haqqımızda' })}</Link></li>
                            <li><Link href="/services" className="text-slate-400 hover:text-white transition-colors">{t('services', { default: 'Xidmətlərimiz' })}</Link></li>
                            <li><Link href="/doctors" className="text-slate-400 hover:text-white transition-colors">{t('doctors', { default: 'Həkimlərimiz' })}</Link></li>
                            <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">{t('blog', { default: 'Bloq' })}</Link></li>
                            <li><Link href="/gallery" className="text-slate-400 hover:text-white transition-colors">{t('gallery', { default: 'Qalereya' })}</Link></li>
                            <li><Link href="/testimonials" className="text-slate-400 hover:text-white transition-colors">{t('testimonials', { default: 'Rəylər' })}</Link></li>
                            <li><Link href="/faq" className="text-slate-400 hover:text-white transition-colors">{t('faq', { default: 'Tez-tez soruşulan suallar' })}</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">{t('ourServices', { default: 'Xidmətlərimiz' })}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-slate-400">{t('serviceKardiologiya', { default: 'Kardiologiya' })}</span></li>
                            <li><span className="text-slate-400">{t('serviceNevrologiya', { default: 'Nevrologiya' })}</span></li>
                            <li><span className="text-slate-400">{t('serviceStomatologiya', { default: 'Stomatologiya' })}</span></li>
                            <li><span className="text-slate-400">{t('serviceLaboratoriya', { default: 'Laboratoriya' })}</span></li>
                            <li><Link href="/services" className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block transition-colors">{t('viewAll', { default: 'Bütün xidmətlərə bax' })} &rarr;</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">{t('contactInfo', { default: 'Əlaqə' })}</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                                <span className="text-slate-400">{t('address', { default: 'Bakı şəhəri, Heydər Əliyev pr. 125' })}</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                                <span className="text-slate-400">+994 12 345 67 89</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                                <span className="text-slate-400">info@ultramed.az</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Ultramed. {t('allRightsReserved', { default: 'Bütün hüquqlar qorunur.' })}</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">{t('privacyPolicy', { default: 'Məxfilik Siyasəti' })}</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">{t('terms', { default: 'İstifadə Şərtləri' })}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
