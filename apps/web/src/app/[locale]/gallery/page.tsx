import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';

export default function GalleryPage() {
    const t = useTranslations('GalleryPage');
    const galleryItems = [
        {
            id: 1,
            title: t('items.0.title'),
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1800&auto=format&fit=crop',
        },
        {
            id: 2,
            title: t('items.1.title'),
            image: 'https://images.unsplash.com/photo-1516549655669-df522f7c8f89?q=80&w=1800&auto=format&fit=crop',
        },
        {
            id: 3,
            title: t('items.2.title'),
            image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1800&auto=format&fit=crop',
        },
        {
            id: 4,
            title: t('items.3.title'),
            image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1800&auto=format&fit=crop',
        },
        {
            id: 5,
            title: t('items.4.title'),
            image: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1800&auto=format&fit=crop',
        },
        {
            id: 6,
            title: t('items.5.title'),
            image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1800&auto=format&fit=crop',
        },
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <section className="py-16 lg:py-20 border-b border-slate-100 bg-white">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-slate-600 text-lg">
                        {t('description')}
                    </p>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden rounded-2xl border-slate-200 shadow-sm hover:shadow-xl transition-shadow">
                                <div className="relative aspect-[4/3]">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
