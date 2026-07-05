'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';
import { getBlogPosts, isBackendUnavailableError, type BlogListItem } from '@/lib/api';
import { shouldBypassImageOptimization } from '@/lib/image';

const ALL_CATEGORIES = '__all__';
const MONTH_NAMES: Record<string, string[]> = {
    az: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ru: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
};

function extractPrice(post: BlogListItem): string | null {
    const source = [post.title, post.excerpt, post.content].filter(Boolean).join(' ');
    const matches = Array.from(source.matchAll(/(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:AZN|₼|manat)/giu));

    if (matches.length === 0) {
        return null;
    }

    return `${matches[matches.length - 1][1].replace('.', ',')} ₼`;
}

export default function BlogPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';
    const t = useTranslations('BlogPage');

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [posts, setPosts] = useState<BlogListItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        let isCancelled = false;

        async function loadPosts() {
            setIsLoading(true);
            setError(null);
            setIsUnavailable(false);

            try {
                const data = await getBlogPosts(locale);
                if (!isCancelled) {
                    setPosts(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
                    if (isBackendUnavailableError(fetchError)) {
                        setIsUnavailable(true);
                        return;
                    }
                    const message = fetchError instanceof Error ? fetchError.message : t('fetchFailedTitle');
                    setError(message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadPosts();

        return () => {
            isCancelled = true;
        };
    }, [locale, refreshKey, t]);

    const categories = useMemo(
        () => {
            const categoryCounts = new Map<string, number>();

            posts.forEach((post) => {
                if (!post.category) {
                    return;
                }

                categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
            });

            return [
                { key: ALL_CATEGORIES, label: t('allCategories'), count: posts.length },
                ...Array.from(categoryCounts.entries()).map(([category, count]) => ({
                    key: category,
                    label: category,
                    count,
                })),
            ];
        },
        [posts, t],
    );

    const filteredPosts = useMemo(() => {
        if (selectedCategory === ALL_CATEGORIES) {
            return posts;
        }
        return posts.filter((post) => post.category === selectedCategory);
    }, [posts, selectedCategory]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    useEffect(() => {
        setVisibleCount(6);
    }, [selectedCategory, locale]);

    const formattedDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const monthNames = MONTH_NAMES[locale] ?? MONTH_NAMES.az;
        const month = monthNames[date.getMonth()];

        if (Number.isNaN(date.getTime()) || !month) {
            return '';
        }

        return `${date.getDate()} ${month} ${date.getFullYear()}`;
    };

    if (isUnavailable && posts.length === 0) {
        return (
            <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
                <div className="container mx-auto max-w-4xl">
                    <TemporaryUnavailable onRetry={() => setRefreshKey((key) => key + 1)} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Category Filter */}
            <section className="bg-white pt-8 pb-4 lg:pt-12">
                <div className="container mx-auto px-6 overflow-x-auto pb-3 scrollbar-hide">
                    <div className="flex items-center gap-3 w-max mx-auto">
                        {categories.map((category) => {
                            const isSelected = selectedCategory === category.key;
                            return (
                                <button
                                    key={category.key}
                                    onClick={() => setSelectedCategory(category.key)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isSelected
                                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                                        : 'bg-white text-slate-700 hover:border-brand-blue/40 border border-slate-200 shadow-sm'
                                        }`}
                                >
                                    {category.label} <span className="text-current/70">({category.count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="bg-white pt-6 pb-16 lg:pb-24 flex-grow">
                <div className="container mx-auto px-6">
                    {isLoading && posts.length === 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                                    <Skeleton className="aspect-video w-full rounded-none" />
                                    <div className="space-y-4 p-5">
                                        <Skeleton className="h-4 w-2/5" />
                                        <Skeleton className="h-6 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error && posts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('fetchFailedTitle')}</h3>
                            <p className="text-slate-500 mb-6">{t('fetchFailedDescription')}</p>
                            <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                                onClick={() => setRefreshKey((key) => key + 1)}
                            >
                                {t('retry')}
                            </Button>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('emptyByCategory')}</h3>
                            <button onClick={() => setSelectedCategory(ALL_CATEGORIES)} className="text-brand-blue font-medium mt-4">
                                {t('allCategories')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {visiblePosts.map((post, index) => {
                                    const postImageSrc = post.image || '/logo.png';
                                    const price = extractPrice(post);

                                    return (
                                        <Link href={`/blog/${post.id}`} key={post.id} className="group flex h-full flex-col">
                                            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                                                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                                                    <Image
                                                        src={postImageSrc}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                                        priority={index < 3}
                                                        unoptimized={shouldBypassImageOptimization(postImageSrc)}
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    {price ? (
                                                        <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-brand-orange/25">
                                                            {price}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="flex min-h-[170px] flex-1 flex-col p-5">
                                                    <div className="mb-3 flex items-center text-sm font-medium text-slate-500">
                                                        <Calendar className="mr-2 h-4 w-4 text-brand-blue" />
                                                        {formattedDate(post.date)}
                                                    </div>
                                                    <h2 className="text-xl font-extrabold leading-snug text-slate-950 transition-colors line-clamp-2 group-hover:text-brand-blue">
                                                        {post.title}
                                                    </h2>
                                                    <p className="mt-3 text-sm font-medium text-slate-500 line-clamp-1">
                                                        {post.author || 'Ultramed Clinic'}
                                                    </p>
                                                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-brand-blue transition-transform group-hover:translate-x-1">
                                                        {t('readMore')}
                                                        <ArrowRight className="h-4 w-4" />
                                                    </span>
                                                </div>
                                            </article>
                                        </Link>
                                    );
                                })}
                            </div>

                            {filteredPosts.length > visibleCount && (
                                <div className="text-center pt-8">
                                    <Button
                                        variant="outline"
                                        className="h-12 rounded-full border-brand-blue px-8 font-bold text-brand-blue hover:bg-brand-blue hover:text-white"
                                        onClick={() => setVisibleCount((count) => count + 6)}
                                    >
                                        {t('loadMore')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
