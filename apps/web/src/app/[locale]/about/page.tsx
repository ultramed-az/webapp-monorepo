import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Target, Heart, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    const t = useTranslations('About');

    const coreValues = [
        {
            icon: <Heart className="h-6 w-6 text-brand-orange" />,
            title: 'Mərhəmət və Qayğı',
            desc: 'Hər bir pasiyentə şəfqətlə yanaşıb onların narahatlığını minimuma endiririk.',
            color: 'bg-brand-orange/10 border-brand-orange/20'
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-brand-blue" />,
            title: 'Dəqiqlik və Etibarlılıq',
            desc: 'Tibbi diaqnozlarımızda dürüstlüyə və ən yüksək standartlara riayət edirik.',
            color: 'bg-brand-blue-soft border-brand-blue/20'
        },
        {
            icon: <Award className="h-6 w-6 text-brand-orange" />,
            title: 'Peşəkarlıq',
            desc: 'Həkimlərimizin davamlı inkişafı və təkmilləşməsi bizim əsas öhdəliyimizdir.',
            color: 'bg-brand-orange/10 border-brand-orange/20'
        }
    ];

    const timeline = [
        { year: '2010', title: 'Klinikanın Əsasının Qoyulması', desc: 'Ultramed klinikası Bakı şəhərində kiçik poliklinika kimi fəaliyyətə başladı.' },
        { year: '2015', title: 'Stasionar Şöbənin Açılışı', desc: 'Pasiyentlərin tələbini nəzərə alaraq 50 çarpayılıq stasionar şöbə və operativ blok istifadəyə verildi.' },
        { year: '2018', title: 'Beynəlxalq Akkreditasiya', desc: 'Klinikamız göstərdiyi xidmətin keyfiyyətinə görə JCI beynəlxalq standartlarına layiq görüldü.' },
        { year: '2023', title: 'İnnovativ Diaqnostika Mərkəzi', desc: 'Regionda ilk dəfə tətbiq edilən yüksək tezlikli MRİ və Genetik Laboratoriya quraşdırıldı.' },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-blue via-transparent to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Biz Kimik?
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Azərbaycanın qabaqcıl tibb müəssisəsi olaraq sağlamlığınız üçün ən düzgün fəlsəfəni – insani yanaşma ilə birləşən müasir texnologiyanı seçmişik.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
                            <Image
                                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
                                alt="Modern Clinic Hospital"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-8 order-1 lg:order-2">
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-brand-blue-soft text-brand-blue font-medium px-4 py-2 rounded-full text-sm mb-4">
                                    <Target className="h-4 w-4" />
                                    <span>Missiyamız</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Mükəmməl Tibbi Xidmət və Güvən</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Ultramed klinikasının missiyası ən son tibbi protokolları tətbiq edərək, hər bir pasiyentin ehtiyaclarına unikal şəkildə yanaşmaq və cəmiyyətin sağlamlıq standartlarını yüksəltməkdir. Bizim üçün hər zaman xəstənin deyil, insanın sağalması ön plandadır.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Uluslararası səviyyədə təsdiqlənmiş müalicə protokolları',
                                    'Dünya standartlarına cavab verən mikrobioloji və genetik laboratoriya',
                                    'Pasiyent hüquqları və məxfiliyinin tam qorunması',
                                    'Erqonomik və stress-free klinika mühiti'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle2 className="h-6 w-6 text-brand-orange mr-3 shrink-0" />
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Əsas Dəyərlərimiz</h2>
                        <p className="text-slate-600 text-lg">
                            İş prinsiplərimizin təməlində bütün heyətimizin inandığı və gündəlik fəaliyyətində irəli sürdüyü bu dəyərlər dayanır.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coreValues.map((val, idx) => (
                            <Card key={idx} className={`border ${val.color} shadow-sm hover:shadow-md transition-shadow bg-white`}>
                                <CardContent className="pt-8 text-center px-6 pb-8">
                                    <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-6 bg-white shadow-sm border ${val.color}`}>
                                        {val.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                                    <p className="text-slate-600">{val.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Qürurverici Tariximiz</h2>
                        <p className="text-slate-600 text-lg">
                            Daimi inkişaf və yeniliklərlə dolu illərimiz bizə böyük təcrübə və bacarıq qazandırdı.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Vertical line connecting events */}
                        <div className="absolute left-[15px] sm:left-1/2 top-0 bottom-0 w-0.5 bg-brand-blue-soft sm:-translate-x-1/2"></div>

                        <div className="space-y-12">
                            {timeline.map((item, idx) => (
                                <div key={idx} className={`relative flex flex-col sm:flex-row items-center ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 sm:left-1/2 w-8 h-8 rounded-full bg-brand-blue border-4 border-white shadow-sm sm:-translate-x-1/2 flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-12">
                                        <div className={`bg-slate-50 p-6 rounded-2xl border border-slate-100 ${idx % 2 === 0 ? 'sm:text-left' : 'sm:text-right'}`}>
                                            <span className="text-brand-blue font-bold text-xl mb-2 block">{item.year}</span>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-brand-blue-dark text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        <div className="px-4">
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 text-brand-orange">14+</div>
                            <div className="text-white/85 font-medium">İl Təcrübə</div>
                        </div>
                        <div className="px-4">
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 text-brand-orange">15K+</div>
                            <div className="text-white/85 font-medium">Sağalmış Pasiyent</div>
                        </div>
                        <div className="px-4">
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 text-brand-orange">50+</div>
                            <div className="text-white/85 font-medium">Peşəkar Həkim</div>
                        </div>
                        <div className="px-4">
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 text-brand-orange">20+</div>
                            <div className="text-white/85 font-medium">İxtisaslaşmış Şöbə</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
