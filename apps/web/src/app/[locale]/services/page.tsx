'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    Activity,
    ArrowRight,
    Baby,
    Bone,
    Brain,
    Eye,
    HeartPulse,
    ShieldCheck,
    Syringe,
    type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    getServiceById,
    getServices,
    type ServiceDetailItem,
    type ServiceListItem,
} from '@/lib/api';

type IconConfig = {
    Icon: LucideIcon;
    iconClassName: string;
    backgroundClassName: string;
};

const ICON_MAP: Record<string, IconConfig> = {
    heartPulse: {
        Icon: HeartPulse,
        iconClassName: 'text-brand-orange',
        backgroundClassName: 'bg-brand-orange/10',
    },
    brain: {
        Icon: Brain,
        iconClassName: 'text-brand-blue',
        backgroundClassName: 'bg-brand-blue-soft',
    },
    shieldCheck: {
        Icon: ShieldCheck,
        iconClassName: 'text-brand-orange',
        backgroundClassName: 'bg-brand-orange/10',
    },
    activity: {
        Icon: Activity,
        iconClassName: 'text-brand-blue',
        backgroundClassName: 'bg-brand-blue-soft',
    },
    baby: {
        Icon: Baby,
        iconClassName: 'text-brand-orange',
        backgroundClassName: 'bg-brand-orange/10',
    },
    eye: {
        Icon: Eye,
        iconClassName: 'text-brand-blue',
        backgroundClassName: 'bg-brand-blue-soft',
    },
    syringe: {
        Icon: Syringe,
        iconClassName: 'text-brand-orange',
        backgroundClassName: 'bg-brand-orange/10',
    },
    bone: {
        Icon: Bone,
        iconClassName: 'text-brand-blue',
        backgroundClassName: 'bg-brand-blue-soft',
    },
};

const FALLBACK_ICON: IconConfig = {
    Icon: Activity,
    iconClassName: 'text-brand-blue',
    backgroundClassName: 'bg-brand-blue-soft',
};

export default function ServicesPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<ServiceListItem[]>([]);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [serviceDetailsById, setServiceDetailsById] = useState<Record<string, ServiceDetailItem>>({});
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadServices() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getServices(locale);
                if (!isCancelled) {
                    setServices(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    const message = fetchError instanceof Error ? fetchError.message : 'Xidmətlər yüklənmədi.';
                    setError(message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        setServiceDetailsById({});
        setSelectedServiceId(null);
        setIsDetailModalOpen(false);
        void loadServices();

        return () => {
            isCancelled = true;
        };
    }, [locale, refreshKey]);

    const selectedService = useMemo(
        () => services.find((service) => service.id === selectedServiceId) ?? null,
        [services, selectedServiceId],
    );

    const selectedServiceDetail = useMemo(
        () => (selectedServiceId ? serviceDetailsById[selectedServiceId] : null),
        [serviceDetailsById, selectedServiceId],
    );

    const openDetailModal = async (serviceId: string) => {
        setSelectedServiceId(serviceId);
        setIsDetailModalOpen(true);
        setDetailError(null);

        if (serviceDetailsById[serviceId]) {
            return;
        }

        setIsDetailLoading(true);
        try {
            const detail = await getServiceById(serviceId, locale);
            if (!detail) {
                setDetailError('Bu xidmət üzrə detallı məlumat tapılmadı.');
                return;
            }

            setServiceDetailsById((current) => ({
                ...current,
                [serviceId]: detail,
            }));
        } catch (fetchError) {
            const message = fetchError instanceof Error ? fetchError.message : 'Detallı məlumat yüklənmədi.';
            setDetailError(message);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const retrySelectedServiceDetail = async () => {
        if (!selectedServiceId) {
            return;
        }
        await openDetailModal(selectedServiceId);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-brand-blue-dark text-white py-16 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-brand-orange/40 via-transparent to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Klinik Xidmətlərimiz</h1>
                        <p className="text-lg md:text-xl text-white/85 leading-relaxed">
                            Müasir tibbin ən son nailiyyətlərini tətbiq edərək, geniş spektrli ixtisaslaşmış tibbi xidmətlərimizlə sağlamlığınızın keşiyindəyik. Hər bir pasiyentə fərdi yanaşma bizim əsas prinsipimizdir.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-50 flex-grow">
                <div className="container mx-auto px-6">
                    {isLoading && services.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Xidmətlər yüklənir...</h3>
                        </div>
                    ) : error && services.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Xidmətlər yüklənmədi</h3>
                            <p className="text-slate-500 mb-6">Zəhmət olmasa bir daha yoxlayın.</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                Yenidən yoxla
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {services.map((service) => {
                                const iconConfig = service.iconKey ? ICON_MAP[service.iconKey] ?? FALLBACK_ICON : FALLBACK_ICON;
                                const ServiceIcon = iconConfig.Icon;

                                return (
                                    <Card
                                        key={service.id}
                                        className="border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white group"
                                    >
                                        <CardHeader>
                                            <div
                                                className={`${iconConfig.backgroundClassName} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                <ServiceIcon className={`h-10 w-10 ${iconConfig.iconClassName}`} />
                                            </div>
                                            <CardTitle className="text-xl text-slate-900 group-hover:text-brand-blue transition-colors">
                                                {service.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <CardDescription className="text-base text-slate-600 leading-relaxed">
                                                {service.summary}
                                            </CardDescription>
                                        </CardContent>
                                        <CardFooter className="pt-4 border-t border-slate-50 mt-auto">
                                            <button
                                                type="button"
                                                onClick={() => void openDetailModal(service.id)}
                                                className="inline-flex items-center text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
                                            >
                                                Daha ətraflı <ArrowRight className="ml-1 w-4 h-4" />
                                            </button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Uyğun Şöbəni Tapa Bilmədiniz?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Ümumi şikayətləriniz varsa, terapevt qəbuluna yazılmağınız məsləhətdir. İlkin müayinədən sonra həkimimiz sizi lazımi profil mütəxəssisinə yönəldəcək.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-full h-14 px-8 text-base"
                        >
                            Terapevt Qəbulu Üçün Yazılın
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft rounded-full h-14 px-8 text-base"
                        >
                            Sual Verin
                        </Button>
                    </div>
                </div>
            </section>

            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-slate-900">
                            {selectedServiceDetail?.title ?? selectedService?.title ?? 'Xidmət Detalları'}
                        </DialogTitle>
                        <DialogDescription className="text-base text-slate-600">
                            {selectedServiceDetail?.summary ?? selectedService?.summary ?? 'Seçilmiş xidmət üzrə detallı məlumat.'}
                        </DialogDescription>
                    </DialogHeader>

                    {isDetailLoading ? (
                        <div className="space-y-3 py-4">
                            <div className="h-4 w-full rounded bg-slate-100"></div>
                            <div className="h-4 w-[92%] rounded bg-slate-100"></div>
                            <div className="h-4 w-[80%] rounded bg-slate-100"></div>
                        </div>
                    ) : detailError ? (
                        <div className="rounded-lg border border-brand-orange/20 bg-brand-orange/10 p-4">
                            <p className="text-brand-orange-dark mb-4">{detailError}</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => void retrySelectedServiceDetail()}
                            >
                                Yenidən yoxla
                            </Button>
                        </div>
                    ) : selectedServiceDetail ? (
                        <div className="space-y-5">
                            <div className="space-y-3 text-slate-700 leading-relaxed">
                                {selectedServiceDetail.content
                                    .split('\n\n')
                                    .map((paragraph) => paragraph.trim())
                                    .filter(Boolean)
                                    .map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                            </div>

                            {selectedServiceDetail.highlights.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 mb-3">
                                        Əsas istiqamətlər
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selectedServiceDetail.highlights.map((item) => (
                                            <li
                                                key={item}
                                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-600">Bu xidmət üzrə məlumat tapılmadı.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
