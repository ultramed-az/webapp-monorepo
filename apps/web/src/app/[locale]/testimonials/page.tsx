'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getTestimonialsPage, isBackendUnavailableError, type TestimonialsPageResponse } from '@/lib/api';

export default function TestimonialsPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [content, setContent] = useState<TestimonialsPageResponse | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadContent() {
            setIsLoading(true);
            setError(null);
            setIsUnavailable(false);

            try {
                const data = await getTestimonialsPage(locale);
                if (!isCancelled) {
                    setContent(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    if (isBackendUnavailableError(fetchError)) {
                        setIsUnavailable(true);
                        return;
                    }
                    const message =
                        fetchError instanceof Error ? fetchError.message : 'Failed to load testimonials';
                    setError(message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadContent();

        return () => {
            isCancelled = true;
        };
    }, [locale, refreshKey]);

    const items = content?.items ?? [];

    if (isUnavailable && !content) {
        return (
            <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
                <div className="container mx-auto max-w-4xl">
                    <TemporaryUnavailable onRetry={() => setRefreshKey((key) => key + 1)} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <section className="py-16 lg:py-20 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    {content ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{content.title}</h1>
                            <p className="text-slate-600 text-lg">{content.description}</p>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="h-12 w-3/4 rounded bg-slate-200 mx-auto"></div>
                            <div className="h-6 w-2/3 rounded bg-slate-200 mx-auto"></div>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6">
                    {isLoading && !content ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Card key={index} className="border-slate-200 rounded-2xl shadow-sm">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="h-4 w-full rounded bg-slate-200"></div>
                                        <div className="h-4 w-[92%] rounded bg-slate-200"></div>
                                        <div className="h-4 w-[80%] rounded bg-slate-200"></div>
                                        <div className="pt-2">
                                            <div className="h-4 w-1/3 rounded bg-slate-200"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : error && !content ? (
                        <div className="max-w-2xl mx-auto text-center rounded-2xl border border-brand-orange/25 bg-brand-orange/10 p-8">
                            <p className="text-brand-orange-dark mb-6">{error}</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((item) => (
                                <Card key={item.id} className="border-slate-200 rounded-2xl shadow-sm">
                                    <CardContent className="p-6 space-y-4">
                                        <p className="text-slate-700 leading-relaxed">"{item.quote}"</p>
                                        <p className="text-brand-orange text-sm">
                                            {'★'.repeat(Math.max(0, Math.min(item.rating, 5)))}
                                        </p>
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.name}</p>
                                            <p className="text-sm text-slate-500">{item.role}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
