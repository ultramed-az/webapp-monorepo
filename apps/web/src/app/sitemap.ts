import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3333';
const locales = ['az', 'en', 'ru'];

const publicRoutes = [
    '',
    '/about',
    '/services',
    '/doctors',
    '/blog',
    '/testimonials',
    '/faq',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/health',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return locales.flatMap((locale) => {
        return publicRoutes.map((route) => ({
            url: `${siteUrl}/${locale}${route}`,
            lastModified: now,
            changeFrequency: route === '' ? 'daily' : 'weekly',
            priority: route === '' ? 1 : 0.7,
        }));
    });
}
