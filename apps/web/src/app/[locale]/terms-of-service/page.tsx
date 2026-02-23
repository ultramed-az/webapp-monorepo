'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getTermsOfServicePage, isBackendUnavailableError, type ContentPageResponse } from '@/lib/api';

export default function TermsOfServicePage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [content, setContent] = useState<ContentPageResponse | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadContent() {
            setIsLoading(true);
            setError(null);
            setIsUnavailable(false);

            try {
                const data = await getTermsOfServicePage(locale);
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
                        fetchError instanceof Error ? fetchError.message : 'Failed to load terms of service';
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
        <div className="min-h-screen bg-white">
            <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    {content ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{content.title}</h1>
                            <p className="text-slate-600 text-lg">{content.description}</p>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="h-12 w-2/3 rounded bg-slate-200"></div>
                            <div className="h-6 w-5/6 rounded bg-slate-200"></div>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    {isLoading && !content ? (
                        <div className="space-y-6">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="h-7 w-1/2 rounded bg-slate-200"></div>
                                    <div className="h-4 w-full rounded bg-slate-200"></div>
                                    <div className="h-4 w-[95%] rounded bg-slate-200"></div>
                                </div>
                            ))}
                        </div>
                    ) : error && !content ? (
                        <div className="max-w-2xl rounded-2xl border border-brand-orange/25 bg-brand-orange/10 p-8">
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
                        <div className="space-y-8 text-slate-700 leading-relaxed">
                            {(content?.sections ?? []).map((section) => (
                                <div key={section.title}>
                                    <h2 className="text-2xl font-semibold text-slate-900 mb-3">{section.title}</h2>
                                    <p>{section.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
