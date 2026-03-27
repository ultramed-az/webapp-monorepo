'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getContactInfo, isBackendUnavailableError, type ContactInfoResponse } from '@/lib/api';

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

type ContactFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export default function ContactPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';
    const t = useTranslations('ContactPage');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formValues, setFormValues] = useState<ContactFormValues>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
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

    const fieldLabels = useMemo(
        () => ({
            firstName: t('firstNameLabel'),
            lastName: t('lastNameLabel'),
            email: t('emailFieldLabel'),
            phone: t('phoneFieldLabel'),
            subject: t('subjectLabel'),
            message: t('messageLabel'),
        }),
        [t],
    );

    useEffect(() => {
        let isCancelled = false;

        async function loadContactInfo() {
            setIsLoading(true);
            setError(null);
            setIsUnavailable(false);
            setContactInfo(fallbackContact);

            try {
                const data = await getContactInfo(locale);
                if (!isCancelled) {
                    setContactInfo(data);
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

        void loadContactInfo();

        return () => {
            isCancelled = true;
        };
    }, [fallbackContact, locale, refreshKey, t]);

    const handleFieldChange = (field: keyof ContactFormValues, value: string) => {
        const nextValue = field === 'phone' ? value.replace(/\D+/g, '') : value;

        setFormValues((prev) => ({
            ...prev,
            [field]: nextValue,
        }));
        setFormErrors((prev) => {
            if (!prev[field]) {
                return prev;
            }

            const nextErrors = { ...prev };
            delete nextErrors[field];
            return nextErrors;
        });
        if (isSubmitted) {
            setIsSubmitted(false);
        }
    };

    const validateForm = () => {
        const errors: ContactFormErrors = {};
        const trimmedValues = {
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
            email: formValues.email.trim(),
            phone: formValues.phone.trim(),
            subject: formValues.subject.trim(),
            message: formValues.message.trim(),
        };

        (Object.keys(trimmedValues) as (keyof ContactFormValues)[]).forEach((field) => {
            if (!trimmedValues[field]) {
                errors[field] = t('validation.requiredField', { field: fieldLabels[field] });
            }
        });

        if (trimmedValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValues.email)) {
            errors.email = t('validation.invalidEmail');
        }

        if (trimmedValues.phone && !/^\d+$/.test(trimmedValues.phone)) {
            errors.phone = t('validation.phoneDigitsOnly');
        }

        return errors;
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setIsSubmitted(false);
            return;
        }

        setFormErrors({});
        setIsSubmitted(true);
        setFormValues({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        });
    };

    if (isUnavailable) {
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
                            {isLoading && (
                                <div className="mb-4 space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            )}

                            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-brand-blue-soft/60">
                                <CardContent className="p-6 flex items-start">
                                    <div className="bg-brand-blue-soft p-3 rounded-full mr-4 text-brand-blue shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{t('addressTitle')}</h3>
                                        {isLoading ? (
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-4/5" />
                                                <Skeleton className="h-3 w-3/4" />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    {contactInfo.address}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    {t('coordinatesLabel')}: {contactInfo.map.latitude.toFixed(6)}, {contactInfo.map.longitude.toFixed(6)}
                                                </p>
                                            </>
                                        )}
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
                                        {isLoading ? (
                                            <div className="space-y-3">
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-4 w-2/3" />
                                            </div>
                                        ) : (
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
                                        )}
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
                                        {isLoading ? (
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-5/6" />
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {contactInfo.workingHours.map((hour) => (
                                                    <p key={`${hour.label}-${hour.value}`} className="text-slate-600 text-sm">
                                                        {hour.label}: {hour.value}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="bg-brand-blue-soft p-3 rounded-full mb-4 text-brand-blue">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">{t('emailTitle')}</h3>
                                        {isLoading ? (
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-4/5" />
                                            </div>
                                        ) : (
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
                                        )}
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

                                    <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-slate-700">{t('firstNameLabel')}</Label>
                                                <Input
                                                    id="firstName"
                                                    value={formValues.firstName}
                                                    onChange={(event) => handleFieldChange('firstName', event.target.value)}
                                                    placeholder={t('firstNamePlaceholder')}
                                                    aria-invalid={Boolean(formErrors.firstName)}
                                                    className={`h-12 bg-slate-50 focus-visible:ring-brand-blue ${formErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                                                />
                                                {formErrors.firstName && <p className="text-sm text-red-600">{formErrors.firstName}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-slate-700">{t('lastNameLabel')}</Label>
                                                <Input
                                                    id="lastName"
                                                    value={formValues.lastName}
                                                    onChange={(event) => handleFieldChange('lastName', event.target.value)}
                                                    placeholder={t('lastNamePlaceholder')}
                                                    aria-invalid={Boolean(formErrors.lastName)}
                                                    className={`h-12 bg-slate-50 focus-visible:ring-brand-blue ${formErrors.lastName ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                                                />
                                                {formErrors.lastName && <p className="text-sm text-red-600">{formErrors.lastName}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-700">{t('emailFieldLabel')}</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formValues.email}
                                                    onChange={(event) => handleFieldChange('email', event.target.value)}
                                                    placeholder={t('emailFieldPlaceholder')}
                                                    aria-invalid={Boolean(formErrors.email)}
                                                    className={`h-12 bg-slate-50 focus-visible:ring-brand-blue ${formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                                                />
                                                {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-slate-700">{t('phoneFieldLabel')}</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    inputMode="numeric"
                                                    value={formValues.phone}
                                                    onChange={(event) => handleFieldChange('phone', event.target.value)}
                                                    placeholder={t('phoneFieldPlaceholder')}
                                                    aria-invalid={Boolean(formErrors.phone)}
                                                    className={`h-12 bg-slate-50 focus-visible:ring-brand-blue ${formErrors.phone ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                                                />
                                                {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-slate-700">{t('subjectLabel')}</Label>
                                            <Input
                                                id="subject"
                                                value={formValues.subject}
                                                onChange={(event) => handleFieldChange('subject', event.target.value)}
                                                placeholder={t('subjectPlaceholder')}
                                                aria-invalid={Boolean(formErrors.subject)}
                                                className={`h-12 bg-slate-50 focus-visible:ring-brand-blue ${formErrors.subject ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                                            />
                                            {formErrors.subject && <p className="text-sm text-red-600">{formErrors.subject}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-slate-700">{t('messageLabel')}</Label>
                                            <Textarea
                                                id="message"
                                                value={formValues.message}
                                                onChange={(event) => handleFieldChange('message', event.target.value)}
                                                placeholder={t('messagePlaceholder')}
                                                rows={5}
                                                aria-invalid={Boolean(formErrors.message)}
                                                className={`bg-slate-50 focus-visible:ring-brand-blue resize-none ${formErrors.message ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-200'}`}
                                            />
                                            {formErrors.message && <p className="text-sm text-red-600">{formErrors.message}</p>}
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
