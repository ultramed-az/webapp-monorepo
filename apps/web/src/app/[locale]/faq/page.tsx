import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';

export default function FaqPage() {
    const t = useTranslations('FaqPage');
    const faqs = [
        { q: t('items.0.question'), a: t('items.0.answer') },
        { q: t('items.1.question'), a: t('items.1.answer') },
        { q: t('items.2.question'), a: t('items.2.answer') },
        { q: t('items.3.question'), a: t('items.3.answer') },
        { q: t('items.4.question'), a: t('items.4.answer') },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-lg text-slate-600">
                        {t('description')}
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((item, index) => (
                                <AccordionItem key={item.q} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-slate-900 text-base md:text-lg">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 leading-relaxed">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </div>
    );
}
