import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../../globals.css';
import AdminShell from '@/components/admin/AdminShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Panel | Ultramed',
    description: 'Ultramed admin panel',
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

export default async function AdminLayout({
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
            <body className={`${inter.className} bg-brand-cream overflow-hidden`}>
                <NextIntlClientProvider messages={messages}>
                    <AdminShell>{children}</AdminShell>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
