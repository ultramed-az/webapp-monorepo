'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Calendar, User, Tag, ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { getBlogPosts, type BlogListItem } from '@/lib/api';

const ALL_CATEGORIES = '__all__';

export default function BlogPage() {
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'az';
    const t = useTranslations('BlogPage');

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<BlogListItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);

    useEffect(() => {
        let isCancelled = false;

        async function loadPosts() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getBlogPosts(locale);
                if (!isCancelled) {
                    setPosts(data);
                }
            } catch (fetchError) {
                if (!isCancelled) {
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

    const allLabel = t('allCategories');

    const categories = useMemo(
        () => [ALL_CATEGORIES, ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))],
        [posts],
    );

    const filteredPosts = useMemo(() => {
        if (selectedCategory === ALL_CATEGORIES) {
            return posts;
        }
        return posts.filter((post) => post.category === selectedCategory);
    }, [posts, selectedCategory]);

    const featuredPost = filteredPosts.find((post) => post.featured) || filteredPosts[0];
    const normalPosts = filteredPosts.filter((post) => post.id !== featuredPost?.id);

    const formattedDate = (isoDate: string) => {
        const dateLocale = locale === 'en' ? 'en-US' : locale === 'ru' ? 'ru-RU' : 'az-AZ';
        return new Intl.DateTimeFormat(dateLocale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date(isoDate));
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-blue via-transparent to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-brand-blue-soft/80 backdrop-blur border border-brand-blue-soft text-brand-blue font-medium px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
                        <BookOpen className="h-4 w-4" />
                        <span>{t('badge')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {t('heroDescription')}
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b border-slate-100 sticky top-[72px] z-40">
                <div className="container mx-auto px-6 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
                    <div className="flex items-center gap-3 w-max mx-auto">
                        {categories.map((category) => {
                            const isSelected = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isSelected
                                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {category === ALL_CATEGORIES ? allLabel : category}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-16 bg-white flex-grow">
                <div className="container mx-auto px-6">
                    {isLoading && posts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('loadingTitle')}</h3>
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
                                {allLabel}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {featuredPost && (
                                <Link href={`/blog/${featuredPost.id}`} className="block group">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 rounded-[2rem] p-6 sm:p-8 lg:p-12 transition-all hover:shadow-xl border border-slate-100">
                                        <div className="relative h-[300px] lg:h-[400px] rounded-3xl overflow-hidden order-2 lg:order-1 shadow-md">
                                            <Image
                                                src={featuredPost.image || '/logo.png'}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-blue font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                                                {t('featuredBadge')}
                                            </div>
                                        </div>
                                        <div className="order-1 lg:order-2 lg:pl-6">
                                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-4">
                                                <span className="flex items-center"><Tag className="w-4 h-4 mr-1.5" />{featuredPost.category}</span>
                                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" />{formattedDate(featuredPost.date)}</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-brand-blue transition-colors leading-tight">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-slate-900 font-medium">
                                                    <div className="w-10 h-10 bg-brand-blue-soft rounded-full flex items-center justify-center mr-3 text-brand-blue">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    {featuredPost.author}
                                                </div>
                                                <div className="inline-flex items-center text-brand-orange font-bold group-hover:translate-x-2 transition-transform">
                                                    {t('readFeatured')} <ArrowRight className="ml-2 w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Normal Posts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {normalPosts.map((post) => (
                                    <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full">
                                        <Card className="flex flex-col h-full bg-white border-slate-100 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group-hover:-translate-y-1">
                                            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                                <Image
                                                    src={post.image || '/logo.png'}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 bg-brand-blue text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                                                    {post.category}
                                                </div>
                                            </div>
                                            <CardContent className="flex flex-col flex-grow p-6">
                                                <div className="flex items-center text-xs font-medium text-slate-500 mb-4 space-x-4">
                                                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formattedDate(post.date)}</span>
                                                    <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-brand-orange font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                                    {t('readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {filteredPosts.length > 0 && (
                                <div className="text-center pt-8">
                                    <Button variant="outline" className="border-slate-300 text-slate-700 px-8 rounded-full h-12">
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
