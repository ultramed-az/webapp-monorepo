import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    const t = useTranslations('ErrorPages');

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-brand-cream px-6">
            <div className="text-center max-w-xl">
                <p className="text-brand-blue font-semibold mb-3">404</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('notFoundTitle')}</h1>
                <p className="text-slate-600 mb-8">
                    {t('notFoundDescription')}
                </p>
                <Button asChild className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                    <Link href="/">{t('backHome')}</Link>
                </Button>
            </div>
        </div>
    );
}
