'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { getContactInfo, type ContactInfoResponse } from '@/lib/api';

function isWhatsAppValue(value: string): boolean {
    return value.toLowerCase().includes('wa.me');
}

function toPhoneHref(value: string): string | null {
    if (isWhatsAppValue(value)) {
        return value.startsWith('http') ? value : `https://${value}`;
    }

    const digits = value.replace(/[^\d+]/g, '');
    if (!digits) {
        return null;
    }

    return `tel:${digits}`;
}

export default function ContactPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';
    const t = useTranslations('ContactPage');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fallbackContact = useMemo<ContactInfoResponse>(
        () => ({
            address: t('fallback.address'),
            map: {
                latitude: 40.3763297,
                longitude: 49.9628667,
                embedUrl: 'https://maps.google.com/maps?q=N%C9%99sr%C9%99ddin%20Tusi%2055%20Baku&z=15&output=embed',
            },
            phones: [
                { label: t('fallback.phoneLabel'), value: '055/070-223-58-56' },
                { label: t('fallback.whatsappLabel'), value: 'https://wa.me/994552235856' },
            ],
            emails: [
                { label: t('fallback.emailLabel'), value: 'ultramedclinics@gmail.com' },
            ],
            workingHours: [
                { label: t('fallback.workDayLabel'), value: '09:00 - 19:00' },
                { label: t('fallback.saturdayLabel'), value: '10:00 - 16:00' },
            ],
        }),
        [t],
    );
    const [contactInfo, setContactInfo] = useState<ContactInfoResponse>(fallbackContact);

    useEffect(() => {
        let isCancelled = false;

        async function loadContactInfo() {
            setIsLoading(true);
            setError(null);
            setContactInfo(fallbackContact);

            try {
                const data = await getContactInfo(locale);
                if (!isCancelled) {
                    setContactInfo(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    const message = fetchError instanceof Error ? fetchError.message : t('fetchFailedDescription');
                    setError(message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadContactInfo();

        return () => {
            isCancelled = true;
        };
    }, [fallbackContact, locale, refreshKey, t]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        e.currentTarget.reset();
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue via-brand-blue-soft to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {t('heroDescription')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    {error && (
                        <div className="mb-8 rounded-lg border border-brand-orange/25 bg-brand-orange/10 px-4 py-3 text-brand-orange-dark flex items-center justify-between gap-4">
                            <span>{t('fetchFailedBanner')}</span>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                {t('retry')}
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Contact Information Cards */}
                        <div className="lg:col-span-5 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('contactMethodsTitle')}</h2>

                            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-brand-blue-soft/60">
                                <CardContent className="p-6 flex items-start">
                                    <div className="bg-brand-blue-soft p-3 rounded-full mr-4 text-brand-blue shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{t('addressTitle')}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {contactInfo.address}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {t('coordinatesLabel')}: {contactInfo.map.latitude.toFixed(6)}, {contactInfo.map.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-start">
                                    <div className="bg-brand-orange/20 p-3 rounded-full mr-4 text-brand-orange shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-3">{t('phoneTitle')}</h3>
                                        <div className="space-y-2">
                                            {contactInfo.phones.map((phone) => (
                                                <div key={`${phone.label}-${phone.value}`}>
                                                    <p className="text-slate-600 text-sm mb-1">{phone.label}</p>
                                                    {toPhoneHref(phone.value) ? (
                                                        <a
                                                            href={toPhoneHref(phone.value) ?? '#'}
                                                            target={isWhatsAppValue(phone.value) ? '_blank' : undefined}
                                                            rel={isWhatsAppValue(phone.value) ? 'noreferrer' : undefined}
                                                            className={`font-semibold text-base transition-colors ${isWhatsAppValue(phone.value) ? 'text-brand-blue hover:text-brand-blue-dark' : 'text-brand-orange-dark hover:text-brand-orange'}`}
                                                        >
                                                            {phone.value.replace(/^https?:\/\//, '')}
                                                        </a>
                                                    ) : (
                                                        <p className="font-semibold text-base text-brand-orange-dark">{phone.value}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="bg-brand-orange/20 p-3 rounded-full mb-4 text-brand-orange">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">{t('workingHoursTitle')}</h3>
                                        <div className="space-y-1">
                                            {contactInfo.workingHours.map((hour) => (
                                                <p key={`${hour.label}-${hour.value}`} className="text-slate-600 text-sm">
                                                    {hour.label}: {hour.value}
                                                </p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="bg-brand-blue-soft p-3 rounded-full mb-4 text-brand-blue">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">{t('emailTitle')}</h3>
                                        <div className="space-y-1">
                                            {contactInfo.emails.map((email) => (
                                                <a
                                                    key={`${email.label}-${email.value}`}
                                                    href={`mailto:${email.value}`}
                                                    className="text-slate-600 text-sm hover:text-brand-blue transition-colors break-all"
                                                >
                                                    {email.value}
                                                </a>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {isLoading && (
                                <p className="text-sm text-slate-500">{t('loadingInfo')}</p>
                            )}
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <Card className="border-slate-200 shadow-xl h-full bg-white">
                                <CardContent className="p-8 sm:p-10">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="bg-brand-blue p-2 rounded-lg text-white">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">{t('formTitle')}</h2>
                                    </div>

                                    {isSubmitted && (
                                        <div className="mb-6 rounded-lg border border-brand-blue/20 bg-brand-blue-soft px-4 py-3 text-brand-blue">
                                            {t('submitSuccess')}
                                        </div>
                                    )}

                                    <form onSubmit={handleFormSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-slate-700">{t('firstNameLabel')}</Label>
                                                <Input id="firstName" placeholder={t('firstNamePlaceholder')} required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-blue" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-slate-700">{t('lastNameLabel')}</Label>
                                                <Input id="lastName" placeholder={t('lastNamePlaceholder')} required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-blue" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-700">{t('emailFieldLabel')}</Label>
                                                <Input id="email" type="email" placeholder={t('emailFieldPlaceholder')} required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-blue" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-slate-700">{t('phoneFieldLabel')}</Label>
                                                <Input id="phone" type="tel" placeholder={t('phoneFieldPlaceholder')} className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-blue" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-slate-700">{t('subjectLabel')}</Label>
                                            <Input id="subject" placeholder={t('subjectPlaceholder')} required className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-blue" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-slate-700">{t('messageLabel')}</Label>
                                            <Textarea
                                                id="message"
                                                placeholder={t('messagePlaceholder')}
                                                rows={5}
                                                required
                                                className="bg-slate-50 border-slate-200 focus-visible:ring-brand-blue resize-none"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-14 bg-brand-orange hover:bg-brand-orange-dark text-white font-medium text-lg rounded-xl">
                                            {t('submitButton')} <Send className="ml-2 w-5 h-5" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] md:h-[500px] w-full bg-slate-100 relative grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe
                    src={contactInfo.map.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={t('mapTitle')}
                    className="absolute inset-0"
                ></iframe>
            </section>
        </div>
    );
}
