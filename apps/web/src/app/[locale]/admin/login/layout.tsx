import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../../../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Login | Ultramed',
    description: 'Ultramed admin login',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default async function LoginLayout({
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
            <body className={`${inter.className} bg-brand-cream flex items-center justify-center min-h-screen`}>
                <NextIntlClientProvider messages={messages}>
                    <main className="w-full">
                        {children}
                    </main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
