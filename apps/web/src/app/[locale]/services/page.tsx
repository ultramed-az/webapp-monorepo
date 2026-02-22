import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import {
    HeartPulse, Activity, Stethoscope, ShieldCheck,
    Brain, Bone, Eye, Baby, Syringe, Microscope, ArrowRight
} from 'lucide-react';

export default function ServicesPage() {
    const t = useTranslations('Services');

    const services = [
        {
            id: 'kardiologiya',
            icon: <HeartPulse className="h-10 w-10 text-brand-orange" />,
            title: 'Kardiologiya',
            desc: 'Ürək-damar sisteminin xəstəliklərinin diaqnostikası, müalicəsi və profilaktikası. EKQ, EXO-KQ və Holter monitorinqi.',
            color: 'bg-brand-orange/10'
        },
        {
            id: 'nevrologiya',
            icon: <Brain className="h-10 w-10 text-brand-blue" />,
            title: 'Nevrologiya',
            desc: 'Mərkəzi və periferik sinir sistemi xəstəliklərinin differensial diaqnostikası və ən son protokollarla müalicəsi.',
            color: 'bg-brand-blue-soft'
        },
        {
            id: 'stomatologiya',
            icon: <ShieldCheck className="h-10 w-10 text-brand-orange" />,
            title: 'Stomatologiya',
            desc: 'Kariesin müalicəsi, implantologiya, ortodontiya, uşaq stomatologiyası və estetik diş görünüşünün bərpası.',
            color: 'bg-brand-orange/10'
        },
        {
            id: 'laboratoriya',
            icon: <Activity className="h-10 w-10 text-brand-blue" />,
            title: 'Klinik Laboratoriya',
            desc: 'Qan, sidik və digər bioloji materialların yüksək dəqiqlikli avtomatlaşdırılmış analizatorlarda sürətli müayinəsi.',
            color: 'bg-brand-blue-soft'
        },
        {
            id: 'pediatriya',
            icon: <Baby className="h-10 w-10 text-brand-orange" />,
            title: 'Pediatriya',
            desc: 'Yeni doğulmuşlardan yeniyetmələrə qədər uşaqların fiziki inkişafının izlənməsi və xəstəliklərin effektiv müalicəsi.',
            color: 'bg-brand-orange/10'
        },
        {
            id: 'oftalmologiya',
            icon: <Eye className="h-10 w-10 text-brand-blue" />,
            title: 'Oftalmologiya',
            desc: 'Gözün refraksiya anomaliyalarının təyini, qlaukoma, katarakta və digər göz xəstəliklərinin aparatla müayinəsi.',
            color: 'bg-brand-blue-soft'
        },
        {
            id: 'cərrahiyyə',
            icon: <Syringe className="h-10 w-10 text-brand-orange" />,
            title: 'Ümumi Cərrahiyyə',
            desc: 'Kiçik invaziv (laparoskopik) və açıq cərrahi əməliyyatların steril cərrahiyyə blokunda təhlükəsiz icrası.',
            color: 'bg-brand-orange/10'
        },
        {
            id: 'travmatologiya',
            icon: <Bone className="h-10 w-10 text-brand-blue" />,
            title: 'Travmatologiya',
            desc: 'Sümük-oynaq sisteminin travmaları, sınıq və çıxıqların müalicəsi, eləcə də ortopedik patologiyaların korreksiyası.',
            color: 'bg-brand-blue-soft'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Page Header */}
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

            {/* Services Grid */}
            <section className="py-20 bg-slate-50 flex-grow">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {services.map((service, idx) => (
                            <Card key={idx} className="border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white group">
                                <CardHeader>
                                    <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {service.icon}
                                    </div>
                                    <CardTitle className="text-xl text-slate-900 group-hover:text-brand-blue transition-colors">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                                        {service.desc}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-slate-50 mt-auto">
                                    <Link href={`/services/${service.id}`} className="inline-flex items-center text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors">
                                        Daha ətraflı <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA specific to Services */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Uyğun Şöbəni Tapa Bilmədiniz?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Ümumi şikayətləriniz varsa, terapevt qəbuluna yazılmağınız məsləhətdir. İlkin müayinədən sonra həkimimiz sizi lazımi profil mütəxəssisinə yönəldəcək.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-full h-14 px-8 text-base">
                            Terapevt Qəbulu Üçün Yazılın
                        </Button>
                        <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft rounded-full h-14 px-8 text-base">
                            Sual Verin
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
