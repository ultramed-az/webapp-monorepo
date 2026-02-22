import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Stethoscope, Clock, ShieldCheck, ArrowRight, Activity, Users } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
    const t = useTranslations('HomePage');

    const features = [
        {
            icon: <Stethoscope className="h-8 w-8 text-brand-blue" />,
            title: t('featureExpert', { default: 'Peşəkar Həkimlər' }),
            description: t('featureExpertDesc', { default: 'Öz sahəsində uzman və beynəlxalq təcrübəli mütəxəssislər.' })
        },
        {
            icon: <Activity className="h-8 w-8 text-brand-orange" />,
            title: t('featureModern', { default: 'Müasir Avadanlıq' }),
            description: t('featureModernDesc', { default: 'Ən son texnologiya ilə təchiz olunmuş laboratoriya və diaqnostika.' })
        },
        {
            icon: <Clock className="h-8 w-8 text-brand-blue" />,
            title: t('feature247', { default: '7/24 Xidmət' }),
            description: t('feature247Desc', { default: 'Təcili hallarda günün hər saatı xidmətinizdəyik.' })
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-brand-orange" />,
            title: t('featureReliable', { default: 'Etibarlı Diaqnoz' }),
            description: t('featureReliableDesc', { default: 'Dəqiq nəticələr və doğru müalicə metodları.' })
        }
    ];

    const stats = [
        { icon: <Users className="h-6 w-6" />, value: '15,000+', label: t('statPatients', { default: 'Məmnun Pasiyent' }) },
        { icon: <Stethoscope className="h-6 w-6" />, value: '50+', label: t('statDoctors', { default: 'Uzman Həkim' }) },
        { icon: <Activity className="h-6 w-6" />, value: '20+', label: t('statDepartments', { default: 'Tibbi Şöbə' }) },
        { icon: <HeartPulse className="h-6 w-6" />, value: '15+', label: t('statYears', { default: 'İllik Təcrübə' }) },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-brand-cream py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-blue via-transparent to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center space-x-2 bg-brand-blue-soft text-brand-blue font-medium px-4 py-2 rounded-full text-sm">
                                <HeartPulse className="h-4 w-4" />
                                <span>{t('heroBadge', { default: 'Sizin Sağlamlığınız Bizim Üçün Dəyərlidir' })}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                                {t('heroTitle', { default: 'Müasir Tibb və İnsani Yanaşma' })}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
                                {t('heroDescription', { default: 'Ultramed klinikası olaraq sağlamlığınız üçün ən qabaqcıl texnologiyalar və peşəkar komandamızla xidmətinizdəyik.' })}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-dark text-white px-8 h-14 text-lg rounded-full">
                                    {t('bookAppointment', { default: 'Onlayn Qəbul' })}
                                </Button>
                                <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft px-8 h-14 text-lg rounded-full">
                                    {t('ourServices', { default: 'Xidmətlərimiz' })} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                            {/* Placeholder for actual hero image. Since we don't have images yet, using a colored div placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue-dark to-brand-blue flex items-center justify-center">
                                <HeartPulse className="h-32 w-32 text-white/20" />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('whyChooseUs', { default: 'Niyə Bizi Seçməlisiniz?' })}</h2>
                        <p className="text-slate-600 text-lg">
                            {t('whyChooseUsDesc', { default: 'Xəstələrimizin məmnuniyyəti və rahatlığı üçün ən yaxşı xidməti təqdim etməyə çalışırıq.' })}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="bg-brand-blue-soft w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-brand-blue">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center space-y-2 text-white px-4">
                                <div className="bg-brand-orange/25 p-3 rounded-full mb-2">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-extrabold">{stat.value}</div>
                                <div className="text-white/90 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-brand-cream">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center max-w-4xl mx-auto border border-brand-orange/20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            {t('ctaTitle', { default: 'Sağlamlığınıza Bu Gün Qayğı Göstərin' })}
                        </h2>
                        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                            {t('ctaDesc', { default: 'Vaxt itirmədən həkim qəbuluna yazılın və peşəkar komandamızın xidmətindən yararlanın.' })}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-dark text-white px-8 h-14 text-lg rounded-full">
                                {t('bookAppointment', { default: 'Qəbul yazılmaq' })}
                            </Button>
                            <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft px-8 h-14 text-lg rounded-full">
                                {t('contactUs', { default: 'Bizimlə Əlaqə' })}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
