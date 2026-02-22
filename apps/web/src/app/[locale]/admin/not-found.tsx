import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function AdminNotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                <p className="text-blue-600 font-semibold mb-2">404</p>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Admin sehifesi tapilmadi</h1>
                <p className="text-slate-600 mb-6">
                    Girdiyiniz admin route movcud deyil. Dashboard sehifesine qayidib menudan davam edin.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/admin/dashboard">Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
