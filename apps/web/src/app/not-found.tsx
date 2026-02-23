import Link from 'next/link';
import { FileSearch, Home, Phone } from 'lucide-react';
import { routing } from '@/i18n/routing';

export default function GlobalNotFoundPage() {
    const locale = routing.defaultLocale;

    return (
        <div className="min-h-screen bg-brand-cream px-6 py-12">
            <div className="mx-auto max-w-4xl rounded-3xl border border-brand-blue/10 bg-white p-8 shadow-sm md:p-12">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-soft text-brand-blue">
                    <FileSearch className="h-7 w-7" />
                </div>
                <p className="mb-2 text-sm font-semibold tracking-[0.24em] text-brand-orange">404</p>
                <h1 className="mb-4 text-4xl font-extrabold text-slate-900">Səhifə tapılmadı</h1>
                <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                    Açmağa çalışdığınız ünvan mövcud deyil və ya dəyişdirilib. Aşağıdakı keçidlərdən istifadə edin.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Ana səhifə
                    </Link>
                    <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center rounded-lg border border-brand-blue/30 px-4 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue-soft"
                    >
                        <Phone className="mr-2 h-4 w-4" />
                        Əlaqə
                    </Link>
                </div>
            </div>
        </div>
    );
}
