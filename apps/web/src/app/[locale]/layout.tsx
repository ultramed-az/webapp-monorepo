import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3333';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    const localeTitleMap: Record<string, string> = {
        az: 'Ultramed Klinikasi',
        en: 'Ultramed Clinic',
        ru: 'Клиника Ultramed',
    };

    const localeDescriptionMap: Record<string, string> = {
        az: 'Ultramed klinikasi: muasir tibbi xidmetler, hekim qebulu ve peşekar tibbi heyet.',
        en: 'Ultramed Clinic: modern medical services, doctor appointments, and expert healthcare team.',
        ru: 'Клиника Ultramed: современные медицинские услуги, прием врачей и опытная команда.',
    };

    const title = localeTitleMap[locale] || localeTitleMap.az;
    const description = localeDescriptionMap[locale] || localeDescriptionMap.az;
    const canonicalPath = locale === routing.defaultLocale ? `/${locale}` : `/${locale}`;

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: title,
            template: `%s | ${title}`,
        },
        description,
        alternates: {
            canonical: canonicalPath,
            languages: {
                az: '/az',
                en: '/en',
                ru: '/ru',
            },
        },
        openGraph: {
            title,
            description,
            type: 'website',
            locale,
            url: canonicalPath,
        },
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    <main className="pt-[84px] lg:pt-[128px] min-h-screen bg-white">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
