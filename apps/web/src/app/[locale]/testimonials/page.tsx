import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
    {
        id: 1,
        name: 'Nigar Hasanli',
        role: 'Pasiyent',
        quote: 'Ultramedde gosterilen diqqet ve pesekarlik cox yuksek seviyyededir. Hekimlerin yanasmasindan cox razi qaldim.',
    },
    {
        id: 2,
        name: 'Samir Aliyev',
        role: 'Pasiyent yaxini',
        quote: 'Anamin mualicesi zamani komanda butun suallarimiza sebrle cavab verdi. Klinika tertemiz ve prosesler nizamli idi.',
    },
    {
        id: 3,
        name: 'Aysel Memmedova',
        role: 'Pasiyent',
        quote: 'Qebul prosesi cox rahat idi, analiz neticeleri vaxtinda cixdi. Tekrar da bu klinikani secerdim.',
    },
    {
        id: 4,
        name: 'Rasim Huseynov',
        role: 'Pasiyent',
        quote: 'Kardiologiya sobesinde cox peşekar xidmet aldim. Mualice plani anlasilan sekilde izah olundu.',
    },
];

export default function TestimonialsPage() {
    return (
        <div className="bg-white min-h-screen">
            <section className="py-16 lg:py-20 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Pasiyent Reyleri</h1>
                    <p className="text-slate-600 text-lg">
                        Bizim ucun en vacib meyar pasiyent memnuniyyetidir. Asagidaki reyler real tecrubeleri eks etdirir.
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((item) => (
                        <Card key={item.id} className="border-slate-200 rounded-2xl shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <p className="text-slate-700 leading-relaxed">"{item.quote}"</p>
                                <div>
                                    <p className="font-semibold text-slate-900">{item.name}</p>
                                    <p className="text-sm text-slate-500">{item.role}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
