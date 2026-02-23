'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/routing';
import AdminShell from '@/components/admin/AdminShell';

type AdminRouteFrameProps = {
    children: ReactNode;
};

export default function AdminRouteFrame({ children }: AdminRouteFrameProps) {
    const pathname = usePathname();
    const isLoginRoute = /^(\/(az|en|ru))?\/admin\/login(\/|$)/.test(pathname);

    if (isLoginRoute) {
        return <>{children}</>;
    }

    return <AdminShell>{children}</AdminShell>;
}
