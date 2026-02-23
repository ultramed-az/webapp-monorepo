import type { Metadata } from 'next';
import AdminRouteFrame from '@/components/admin/AdminRouteFrame';

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminRouteFrame>{children}</AdminRouteFrame>;
}
