import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../../../globals.css';

const inter = Inter({ subsets: ['latin'] });

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
            <body className={`${inter.className} bg-slate-50 flex items-center justify-center min-h-screen`}>
                <NextIntlClientProvider messages={messages}>
                    <main className="w-full">
                        {children}
                    </main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
