import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-brand-cream px-6">
            <div className="text-center max-w-xl">
                <p className="text-brand-blue font-semibold mb-3">404</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Sehife tapilmadi</h1>
                <p className="text-slate-600 mb-8">
                    Axtardiginiz sehife movcud deyil ve ya silinib. Ana sehifeye qayidaraq davam ede bilersiniz.
                </p>
                <Button asChild className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                    <Link href="/">Ana sehifeye qayit</Link>
                </Button>
            </div>
        </div>
    );
}
