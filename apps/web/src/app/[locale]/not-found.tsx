import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileSearch, Home, Phone, Stethoscope } from 'lucide-react';

export default function NotFound() {
    const t = useTranslations('ErrorPages');
    const nav = useTranslations('Navigation');

    return (
        <div className="min-h-[78vh] bg-brand-cream px-6 py-12">
            <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
                <section className="relative overflow-hidden rounded-3xl border border-brand-blue/10 bg-white p-8 md:p-12 shadow-sm">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-brand-blue-soft/70" />
                    <div className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-brand-orange/15" />
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-soft text-brand-blue">
                            <FileSearch className="h-7 w-7" />
                        </div>
                        <p className="mb-2 text-sm font-semibold tracking-[0.24em] text-brand-orange">404</p>
                        <h1 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">{t('notFoundTitle')}</h1>
                        <p className="max-w-xl text-lg leading-relaxed text-slate-600">{t('notFoundDescription')}</p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    {t('backHome')}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue-soft">
                                <Link href="/contact">
                                    <Phone className="mr-2 h-4 w-4" />
                                    {t('contactPage')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{t('notFoundHelpBadge')}</p>
                    <h2 className="mb-3 text-2xl font-bold text-slate-900">{t('notFoundHelpTitle')}</h2>
                    <p className="mb-6 text-sm leading-relaxed text-slate-600">{t('notFoundHelpDescription')}</p>

                    <div className="space-y-3">
                        <Link
                            href="/services"
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand-blue/30 hover:bg-brand-blue-soft"
                        >
                            <span className="inline-flex items-center">
                                <Stethoscope className="mr-2 h-4 w-4 text-brand-blue" />
                                {nav('services')}
                            </span>
                            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-blue" />
                        </Link>
                        <Link
                            href="/doctors"
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand-blue/30 hover:bg-brand-blue-soft"
                        >
                            <span>{nav('doctors')}</span>
                            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-blue" />
                        </Link>
                        <Link
                            href="/blog"
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand-blue/30 hover:bg-brand-blue-soft"
                        >
                            <span>{nav('blog')}</span>
                            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-blue" />
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
