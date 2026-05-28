'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getContactInfo, type ContactInfoResponse } from '@/lib/api';

function isWhatsAppValue(value: string): boolean {
    return value.toLowerCase().includes('wa.me');
}

export default function Footer() {
    const t = useTranslations('Footer');
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';
    const fallbackContactInfo = useMemo<ContactInfoResponse>(
        () => ({
            address: t('address'),
            map: {
                latitude: 40.3763297,
                longitude: 49.9628667,
                embedUrl: 'https://maps.google.com/maps?q=N%C9%99sr%C9%99ddin%20Tusi%2055%20Baku&z=15&output=embed',
            },
            phones: [
                { label: t('contactInfo'), value: '055/070-223-58-56' },
                { label: t('whatsapp'), value: 'https://wa.me/994552235856' },
            ],
            emails: [{ label: t('contactInfo'), value: 'ultramedclinics@gmail.com' }],
            workingHours: [],
        }),
        [t],
    );
    const [contactInfo, setContactInfo] = useState<ContactInfoResponse>(fallbackContactInfo);

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
                // Keep fallback values in footer if API request fails.
            }
        }

        void loadContactInfo();

        return () => {
            isCancelled = true;
        };
    }, [fallbackContactInfo, locale]);

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

    const primaryEmail = useMemo(() => contactInfo.emails[0]?.value ?? '', [contactInfo.emails]);

    return (
        <footer className="bg-brand-blue-dark text-slate-100">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & About */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.png"
                                alt="Ultramed"
                                width={170}
                                height={50}
                                className="h-11 w-auto"
                            />
                        </Link>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {t('description', { default: 'Sizin sağlamlığınız bizim prioritetimizdir. Müasir avadanlıqlar və peşəkar həkim kollektivi.' })}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-slate-200 hover:text-brand-orange transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">{t('social.facebook')}</span>
                            </a>
                            <a
                                href="https://www.instagram.com/ultramed_clinic"
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-200 hover:text-brand-orange transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">{t('social.instagram')}</span>
                            </a>
                            <a href="#" className="text-slate-200 hover:text-brand-orange transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">{t('social.linkedin')}</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">{t('quickLinks', { default: 'Cəld Keçid' })}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-slate-300 hover:text-brand-orange transition-colors">{t('home', { default: 'Ana Səhifə' })}</Link></li>
                            <li><Link href="/about" className="text-slate-300 hover:text-brand-orange transition-colors">{t('about', { default: 'Haqqımızda' })}</Link></li>
                            <li><Link href="/services" className="text-slate-300 hover:text-brand-orange transition-colors">{t('services', { default: 'Xidmətlərimiz' })}</Link></li>
                            <li><Link href="/doctors" className="text-slate-300 hover:text-brand-orange transition-colors">{t('doctors', { default: 'Həkimlərimiz' })}</Link></li>
                            <li><Link href="/blog" className="text-slate-300 hover:text-brand-orange transition-colors">{t('blog', { default: 'Bloq' })}</Link></li>
                            <li><Link href="/testimonials" className="text-slate-300 hover:text-brand-orange transition-colors">{t('testimonials', { default: 'Rəylər' })}</Link></li>
                            <li><Link href="/faq" className="text-slate-300 hover:text-brand-orange transition-colors">{t('faq', { default: 'Tez-tez soruşulan suallar' })}</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">{t('ourServices', { default: 'Xidmətlərimiz' })}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-slate-300">{t('serviceKardiologiya', { default: 'Kardiologiya' })}</span></li>
                            <li><span className="text-slate-300">{t('serviceNevrologiya', { default: 'Nevrologiya' })}</span></li>
                            <li><span className="text-slate-300">{t('serviceStomatologiya', { default: 'Stomatologiya' })}</span></li>
                            <li><span className="text-slate-300">{t('serviceLaboratoriya', { default: 'Laboratoriya' })}</span></li>
                            <li><Link href="/services" className="text-brand-orange hover:text-white text-xs mt-2 inline-block transition-colors">{t('viewAll', { default: 'Bütün xidmətlərə bax' })} &rarr;</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">{t('contactInfo', { default: 'Əlaqə' })}</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-brand-orange mr-2 shrink-0" />
                                <span className="text-slate-300">{contactInfo.address}</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-brand-orange mr-2 shrink-0" />
                                <a
                                    href={`tel:${primaryPhone.replace(/[^\d+]/g, '')}`}
                                    className="text-slate-300 hover:text-brand-orange transition-colors"
                                >
                                    {primaryPhone}
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-brand-orange mr-2 shrink-0" />
                                <a href={`mailto:${primaryEmail}`} className="text-slate-300 hover:text-brand-orange transition-colors break-all">
                                    {primaryEmail}
                                </a>
                            </li>
                            {whatsappLink && (
                                <li className="flex items-center">
                                    <MessageCircle className="h-5 w-5 text-brand-orange mr-2 shrink-0" />
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-slate-300 hover:text-brand-orange transition-colors"
                                    >
                                        {t('whatsapp')}: {whatsappLink.replace(/^https?:\/\//, '')}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-300">
                    <p>&copy; {new Date().getFullYear()} Ultramed. {t('allRightsReserved', { default: 'Bütün hüquqlar qorunur.' })}</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-brand-orange transition-colors">{t('privacyPolicy', { default: 'Məxfilik Siyasəti' })}</Link>
                        <Link href="/terms-of-service" className="hover:text-brand-orange transition-colors">{t('terms', { default: 'İstifadə Şərtləri' })}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
