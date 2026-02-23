import { useTranslations } from 'next-intl';

export default function TermsOfServicePage() {
    const t = useTranslations('TermsPage');
    const sections = [
        { title: t('sections.0.title'), content: t('sections.0.content') },
        { title: t('sections.1.title'), content: t('sections.1.content') },
        { title: t('sections.2.title'), content: t('sections.2.content') },
        { title: t('sections.3.title'), content: t('sections.3.content') },
        { title: t('sections.4.title'), content: t('sections.4.content') },
    ];

    return (
        <div className="min-h-screen bg-white">
            <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-slate-600 text-lg">
                        {t('description')}
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 max-w-4xl space-y-8 text-slate-700 leading-relaxed">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-3">{section.title}</h2>
                            <p>{section.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
