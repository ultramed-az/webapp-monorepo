import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function InternalServerErrorPage() {
    const t = useTranslations('ErrorPages');

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-brand-cream px-6">
            <div className="text-center max-w-xl">
                <p className="text-brand-orange font-semibold mb-3">500</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('internalTitle')}</h1>
                <p className="text-slate-600 mb-8">
                    {t('internalDescription')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                        <Link href="/">{t('backHome')}</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/contact">{t('contactPage')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
