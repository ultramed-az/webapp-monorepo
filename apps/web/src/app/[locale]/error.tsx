'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function Error({
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
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-6">
            <div className="text-center max-w-xl">
                <p className="text-red-600 font-semibold mb-3">500</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Xeta bas verdi</h1>
                <p className="text-slate-600 mb-8">
                    Gozlenilmez texniki xeta yarandi. Zehmet olmasa yeniden yoxlayin.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Yeniden cehd et
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">Ana sehife</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
