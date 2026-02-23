'use client';

import { useTranslations } from 'next-intl';
import { Menu, Search, Bell, User } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { logoutAdmin } from '@/lib/admin-api';

type HeaderProps = {
    onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    const t = useTranslations('Admin');
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAdmin();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <header className="h-16 bg-white border-b border-brand-blue-soft flex items-center justify-between px-4 lg:px-6 z-10">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-500 hover:text-slate-700"
                    onClick={onMenuClick}
                    aria-label={t('openMenu', { default: 'Open menu' })}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                <div className="hidden sm:flex relative max-w-md w-full ml-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder={t('search', { default: 'Search...' })}
                        className="w-full bg-slate-50 border-slate-200 pl-9 rounded-full h-9 focus-visible:ring-brand-blue"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-orange rounded-full border border-white" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative flex items-center gap-2 h-9 pl-2 pr-4 rounded-full border border-slate-200 ml-2 hover:bg-slate-50">
                            <div className="w-6 h-6 rounded-full bg-brand-blue-soft flex items-center justify-center text-brand-blue font-semibold text-xs">
                                A
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Super Admin</p>
                                <p className="text-xs leading-none text-muted-foreground">admin@ultramed.az</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>{t('profile', { default: 'Profile' })}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-brand-orange focus:text-brand-orange-dark focus:bg-brand-orange/10"
                            onClick={handleLogout}
                        >
                            {t('logout', { default: 'Logout' })}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
