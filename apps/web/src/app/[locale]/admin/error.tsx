'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-brand-cream">
            <div className="text-center max-w-lg">
                <p className="text-brand-orange font-semibold mb-2">500</p>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Admin xetasi</h1>
                <p className="text-slate-600 mb-6">
                    Gozlenilmez xeta yarandi. Yeniden cehd ede ve ya dashboarda qayida bilersiniz.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Button onClick={reset} className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                        Yeniden cehd et
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/dashboard">Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
