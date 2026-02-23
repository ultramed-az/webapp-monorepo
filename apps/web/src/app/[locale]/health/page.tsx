import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HealthPage() {
    const t = useTranslations('HealthPage');
    const now = new Date().toISOString();

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container mx-auto px-6 max-w-3xl">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-slate-900">{t('title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-slate-700">
                        <p>
                            {t('description')}
                        </p>
                        <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-sm">
                            <p><strong>{t('statusLabel')}:</strong> ok</p>
                            <p><strong>{t('componentLabel')}:</strong> web-frontend</p>
                            <p><strong>{t('checkedAtLabel')}:</strong> {now}</p>
                        </div>
                        <p>
                            {t('endpointLabel')}: <Link href="/health" className="text-brand-blue hover:underline">/health</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
