'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getGalleryItems, isBackendUnavailableError, type GalleryItem } from '@/lib/api';

export default function GalleryPage() {
  const t = useTranslations('GalleryPage');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'az';

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      setLoading(true);
      setErrorMessage(null);
      setIsUnavailable(false);

      try {
        const data = await getGalleryItems(locale);
        if (!cancelled) {
          setItems(data);
        }
      } catch (error) {
        if (!cancelled) {
          if (isBackendUnavailableError(error)) {
            setIsUnavailable(true);
            return;
          }

          setErrorMessage(error instanceof Error ? error.message : 'Qalereya məlumatları yüklənmədi.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadGallery();
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
    <div className="bg-slate-50 min-h-screen">
      <section className="py-16 lg:py-20 border-b border-slate-100 bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('title')}</h1>
          <p className="text-slate-600 text-lg">{t('description')}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={String(index)} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : errorMessage ? (
            <div className="max-w-xl mx-auto rounded-lg border border-red-200 bg-red-50 p-4 text-center">
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
            <div className="max-w-xl mx-auto rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500">
              {t('empty', { default: 'Hazırda qalereya məlumatı yoxdur.' })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-2xl border-slate-200 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.imageUrl}
                      alt={item.caption || 'Gallery image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-semibold text-slate-900">{item.caption}</h2>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
