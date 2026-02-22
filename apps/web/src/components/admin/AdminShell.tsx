'use client';

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

type AdminShellProps = {
    children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
                    {children}
                </main>
            </div>

            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-72 border-r-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Admin navigation</SheetTitle>
                    </SheetHeader>
                    <Sidebar mobile onNavigate={() => setIsSidebarOpen(false)} />
                </SheetContent>
            </Sheet>
        </div>
    );
}
