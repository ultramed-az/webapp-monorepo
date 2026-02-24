'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Calendar, Eye, Tag, User } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getBlogPostById, isBackendUnavailableError, type BlogListItem } from '@/lib/api';
import { shouldBypassImageOptimization } from '@/lib/image';

function normalizeLocale(localeRaw: string | undefined): 'az' | 'en' | 'ru' {
  if (localeRaw === 'en' || localeRaw === 'ru') {
    return localeRaw;
  }
  return 'az';
}

export default function BlogDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = normalizeLocale(params?.locale);
  const blogId = params?.id;

  const t = useTranslations('BlogPage');
  const errorT = useTranslations('ErrorPages');
  const nav = useTranslations('Navigation');

  const [post, setPost] = useState<BlogListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      if (!blogId) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsUnavailable(false);
      setIsNotFound(false);

      try {
        const data = await getBlogPostById(blogId, locale);
        if (cancelled) {
          return;
        }

        if (!data) {
          setIsNotFound(true);
          setPost(null);
          return;
        }

        setPost(data);
      } catch (fetchError) {
        if (cancelled) {
          return;
        }

        if (isBackendUnavailableError(fetchError)) {
          setIsUnavailable(true);
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : t('fetchFailedDescription'));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      cancelled = true;
    };
  }, [blogId, locale, refreshKey, t]);

  const formattedDate = useMemo(() => {
    if (!post) {
      return '';
    }

    const dateLocale = locale === 'en' ? 'en-US' : locale === 'ru' ? 'ru-RU' : 'az-AZ';
    return new Intl.DateTimeFormat(dateLocale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(post.date));
  }, [locale, post]);

  const imageSrc = post?.image ?? '/logo.png';

  if (isUnavailable && !post) {
    return (
      <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
        <div className="container mx-auto max-w-4xl">
          <TemporaryUnavailable onRetry={() => setRefreshKey((key) => key + 1)} />
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
        <div className="container mx-auto max-w-4xl">
          <Card className="rounded-3xl border-slate-200 bg-white p-10 text-center">
            <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-brand-orange">404</p>
            <h1 className="mb-3 text-3xl font-extrabold text-slate-900">{errorT('notFoundTitle')}</h1>
            <p className="mx-auto mb-7 max-w-2xl text-slate-600">{errorT('notFoundDescription')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-brand-blue hover:bg-brand-blue-dark text-white">
                <Link href="/blog">{nav('blog')}</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 text-slate-700">
                <Link href="/">{errorT('backHome')}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-cream py-10 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <Button asChild variant="outline" className="border-slate-300 text-slate-700">
            <Link href="/blog">{nav('blog')}</Link>
          </Button>
        </div>
      </section>

      <article className="py-10 lg:py-14">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-[360px] w-full rounded-3xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <Card className="rounded-3xl border-red-200 bg-red-50 p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">{t('fetchFailedTitle')}</h2>
              <p className="mb-6 text-red-700">{error}</p>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => setRefreshKey((key) => key + 1)}
              >
                {t('retry')}
              </Button>
            </Card>
          ) : post ? (
            <div className="space-y-8">
              <header className="space-y-4">
                {post.category && (
                  <span className="inline-flex items-center rounded-full bg-brand-blue-soft px-3 py-1 text-xs font-semibold text-brand-blue">
                    <Tag className="mr-1.5 h-3.5 w-3.5" />
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {formattedDate}
                  </span>
                  <span className="inline-flex items-center">
                    <User className="mr-1.5 h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="inline-flex items-center">
                    <Eye className="mr-1.5 h-4 w-4" />
                    {post.views}
                  </span>
                </div>
              </header>

              <div className="relative h-[240px] md:h-[380px] w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-100">
                <Image
                  src={imageSrc}
                  alt={post.title}
                  fill
                  unoptimized={shouldBypassImageOptimization(imageSrc)}
                  className="object-cover"
                  priority
                />
              </div>

              {post.excerpt ? (
                <p className="rounded-2xl border border-brand-blue/10 bg-brand-blue-soft/40 px-5 py-4 text-lg leading-relaxed text-slate-700">
                  {post.excerpt}
                </p>
              ) : null}

              <div className="space-y-5 text-[17px] leading-8 text-slate-700">
                {post.content
                  .split('\n\n')
                  .map((chunk) => chunk.trim())
                  .filter(Boolean)
                  .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}
