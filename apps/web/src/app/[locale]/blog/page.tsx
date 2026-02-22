'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Calendar, User, Tag, ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';

const blogPosts = [
    {
        id: 1,
        title: 'Ürək sağlamlığı üçün 5 qızıl qayda',
        excerpt: 'Kardioloqlarımızın məsləhətləri ilə gündəlik həyatınızda edəcəyiniz kiçik dəyişikliklərlə ürəyinizi qoruya bilərsiniz.',
        author: 'Dr. Əli Vəliyev',
        category: 'Kardiologiya',
        date: '14 Mart, 2024',
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop',
        featured: true
    },
    {
        id: 2,
        title: 'Bahar aylarında allergiyadan necə qorunmalı?',
        excerpt: 'Mövsümi allergiyaların qarşısını almaq və simptomları yüngülləşdirmək üçün mütəxəssis tövsiyələri.',
        author: 'Dr. Famil Abbasov',
        category: 'Terapiya',
        date: '10 Mart, 2024',
        image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=600&auto=format&fit=crop',
        featured: false
    },
    {
        id: 4,
        title: 'Sağlam qidalanmanın əsasları nədir?',
        excerpt: 'Düzgün və balanslı qidalanma rejimi ilə immun sisteminizi necə gücləndirə biləcəyiniz haqqında vacib məlumatlar.',
        author: 'Dr. Leyla Quliyeva',
        category: 'Dietologiya',
        date: '28 Fevral, 2024',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
        featured: false
    },
    {
        id: 5,
        title: 'Göz sağlamlığını qorumağın qızıl qaydaları',
        excerpt: 'Rəqəmsal cihazlardan istifadə zamanı göz yorğunluğunun və digər problemlərin qarşısını necə almalı?',
        author: 'Dr. Rəhman Qasımlı',
        category: 'Oftalmologiya',
        date: '20 Fevral, 2024',
        image: 'https://images.unsplash.com/photo-1516069632884-6997cf29f4b9?q=80&w=600&auto=format&fit=crop',
        featured: false
    },
    {
        id: 6,
        title: 'Uşaqlarda düzgün qamət vərdişləri',
        excerpt: 'Onurğa sütununun inkişafı və məktəb yaşlı uşaqlarda skoliozun qarşısının alınması üçün ən yaxşı üsullar.',
        author: 'Dr. Leyla Quliyeva',
        category: 'Pediatriya',
        date: '15 Fevral, 2024',
        image: 'https://images.unsplash.com/photo-1473215284483-e18d6e3860bb?q=80&w=600&auto=format&fit=crop',
        featured: false
    }
];

export default function BlogPage() {
    const t = useTranslations('Blog');
    const [selectedCategory, setSelectedCategory] = useState<string>('Bütün Kateqoriyalar');

    const categories = ['Bütün Kateqoriyalar', ...Array.from(new Set(blogPosts.map(p => p.category)))];

    const filteredPosts = selectedCategory === 'Bütün Kateqoriyalar'
        ? blogPosts
        : blogPosts.filter(p => p.category === selectedCategory);

    const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
    const normalPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-slate-50 py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-blue-100 text-blue-700 font-medium px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
                        <BookOpen className="h-4 w-4" />
                        <span>Tibbi Bloq</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Faydalı Məlumatlar
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Həkimlərimizin tövsiyələri, ən son tibbi xəbərlər və sağlam həyat üçün maraqlı məqalələrlə tanış olun.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b border-slate-100 sticky top-[72px] z-40">
                <div className="container mx-auto px-6 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
                    <div className="flex items-center gap-3 w-max mx-auto">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-16 bg-white flex-grow">
                <div className="container mx-auto px-6">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Bu kateqoriyaya uyğun məqalə tapılmadı</h3>
                            <button onClick={() => setSelectedCategory('Bütün Kateqoriyalar')} className="text-blue-600 font-medium mt-4">
                                Bütün məqalələrə qayıt
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Featured Post (if doing "Bütün Kateqoriyalar" or if a featured post exists) */}
                            {featuredPost && (
                                <Link href={`/blog/${featuredPost.id}`} className="block group">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-50 rounded-[2rem] p-6 sm:p-8 lg:p-12 transition-all hover:shadow-xl border border-slate-100">
                                        <div className="relative h-[300px] lg:h-[400px] rounded-3xl overflow-hidden order-2 lg:order-1 shadow-md">
                                            <Image
                                                src={featuredPost.image}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-700 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                                                GÜNÜN MƏQALƏSİ
                                            </div>
                                        </div>
                                        <div className="order-1 lg:order-2 lg:pl-6">
                                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-4">
                                                <span className="flex items-center"><Tag className="w-4 h-4 mr-1.5" />{featuredPost.category}</span>
                                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" />{featuredPost.date}</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-blue-700 transition-colors leading-tight">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-slate-900 font-medium">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    {featuredPost.author}
                                                </div>
                                                <div className="inline-flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                                                    Oxu <ArrowRight className="ml-2 w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Normal Posts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {normalPosts.map(post => (
                                    <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full">
                                        <Card className="flex flex-col h-full bg-white border-slate-100 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group-hover:-translate-y-1">
                                            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 bg-blue-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                                                    {post.category}
                                                </div>
                                            </div>
                                            <CardContent className="flex flex-col flex-grow p-6">
                                                <div className="flex items-center text-xs font-medium text-slate-500 mb-4 space-x-4">
                                                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{post.date}</span>
                                                    <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                                    Ətraflı <ArrowRight className="ml-1 w-4 h-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination/Load More Placeholder */}
                            {filteredPosts.length > 0 && (
                                <div className="text-center pt-8">
                                    <Button variant="outline" className="border-slate-300 text-slate-700 px-8 rounded-full h-12">
                                        Daha Çox Yüklə
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
