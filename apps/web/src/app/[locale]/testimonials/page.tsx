import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function TestimonialsPage() {
    const t = useTranslations('TestimonialsPage');
    const testimonials = [
        {
            id: 1,
            name: t('items.0.name'),
            role: t('items.0.role'),
            quote: t('items.0.quote'),
        },
        {
            id: 2,
            name: t('items.1.name'),
            role: t('items.1.role'),
            quote: t('items.1.quote'),
        },
        {
            id: 3,
            name: t('items.2.name'),
            role: t('items.2.role'),
            quote: t('items.2.quote'),
        },
        {
            id: 4,
            name: t('items.3.name'),
            role: t('items.3.role'),
            quote: t('items.3.quote'),
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            <section className="py-16 lg:py-20 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-slate-600 text-lg">
                        {t('description')}
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
