import type { Metadata } from 'next';

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

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
