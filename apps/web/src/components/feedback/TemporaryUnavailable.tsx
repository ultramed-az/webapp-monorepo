'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TemporaryUnavailableProps = {
    onRetry?: () => void;
    className?: string;
    compact?: boolean;
};

export default function TemporaryUnavailable({ onRetry, className, compact = false }: TemporaryUnavailableProps) {
    const t = useTranslations('ErrorPages');

    return (
        <section
            className={cn(
                'relative overflow-hidden rounded-3xl border border-brand-blue/10 bg-white shadow-sm',
                compact ? 'p-6' : 'p-8 md:p-12',
                className,
            )}
        >
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-blue-soft/60" />
            <div className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-brand-orange/10" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange">
                    <AlertTriangle className="h-7 w-7" />
                </div>
                <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-brand-orange">503</p>
                <h1 className="mb-3 text-3xl font-extrabold text-slate-900">{t('temporarilyUnavailableTitle')}</h1>
                <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-600">
                    {t('temporarilyUnavailableDescription')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {onRetry && (
                        <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white" onClick={onRetry}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            {t('retry')}
                        </Button>
                    )}
                    <Button asChild variant="outline" className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue-soft">
                        <Link href="/">{t('backHome')}</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-200 text-slate-700">
                        <Link href="/contact">{t('contactPage')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
