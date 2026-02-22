import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function AdminServerErrorPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                <p className="text-red-600 font-semibold mb-2">500</p>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Admin panelde xeta bas verdi</h1>
                <p className="text-slate-600 mb-6">
                    Texniki problem askarlandi. Zehmet olmasa bir nece deqiqeden sonra yeniden cehd edin.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/admin/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/login">Login</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
