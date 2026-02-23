'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getFaqItems, isBackendUnavailableError, type FaqItem } from '@/lib/api';

export default function FaqPage() {
  const t = useTranslations('FaqPage');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'az';

  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadFaq() {
      setLoading(true);
      setErrorMessage(null);
      setIsUnavailable(false);

      try {
        const data = await getFaqItems(locale);
        if (!cancelled) {
          setItems(data);
        }
      } catch (error) {
        if (!cancelled) {
          if (isBackendUnavailableError(error)) {
            setIsUnavailable(true);
            return;
          }

          setErrorMessage(error instanceof Error ? error.message : 'FAQ məlumatları yüklənmədi.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadFaq();
    return () => {
      cancelled = true;
    };
  }, [locale, refreshKey]);

  if (isUnavailable && items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-6 py-12">
        <div className="container mx-auto max-w-4xl">
          <TemporaryUnavailable onRetry={() => setRefreshKey((key) => key + 1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-slate-600">{t('description')}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={String(index)} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : errorMessage ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
                <Button
                  variant="outline"
                  onClick={() => setRefreshKey((key) => key + 1)}
                  className="border-red-200 text-red-700 hover:bg-red-100"
                >
                  {t('retry', { default: 'Yenidən cəhd et' })}
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500">
                {t('empty', { default: 'Hazırda FAQ məlumatı yoxdur.' })}
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => (
                  <AccordionItem key={item.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-slate-900 text-base md:text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
