'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('ErrorPages');

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-brand-cream px-6">
            <div className="text-center max-w-xl">
                <p className="text-brand-orange font-semibold mb-3">500</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('genericTitle')}</h1>
                <p className="text-slate-600 mb-8">
                    {t('genericDescription')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button onClick={reset} className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                        {t('retry')}
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">{t('home')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
