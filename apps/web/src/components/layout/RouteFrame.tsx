'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type RouteFrameProps = {
    children: ReactNode;
};

export default function RouteFrame({ children }: RouteFrameProps) {
    const pathname = usePathname();
    const isAdminRoute = /^(\/(az|en|ru))?\/admin(\/|$)/.test(pathname);

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="pt-[84px] lg:pt-[128px] min-h-screen bg-white">
                {children}
            </main>
            <Footer />
        </>
    );
}
