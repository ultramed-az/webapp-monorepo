'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Menu, User } from 'lucide-react';
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
import { logoutAdmin, logoutAllAdmin } from '@/lib/admin-api';

type HeaderProps = {
    onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    const t = useTranslations('Admin');
    const router = useRouter();
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

    const notifications = useMemo(
        () => [
            {
                id: 'session-security',
                title: t('notificationSecurityTitle', { default: 'Session security is active' }),
                description: t('notificationSecurityDescription', {
                    default: 'You can end all active sessions from the profile menu at any time.',
                }),
            },
            {
                id: 'media-management',
                title: t('notificationMediaTitle', { default: 'Media management is enabled' }),
                description: t('notificationMediaDescription', {
                    default: 'Uploaded images and files can be reviewed from the Media section.',
                }),
            },
        ],
        [t],
    );

    const handleLogout = async () => {
        try {
            await logoutAdmin();
        } finally {
            router.push('/admin/login');
            router.refresh();
        }
    };

    const handleLogoutAll = async () => {
        const accepted = window.confirm('Bütün aktiv sessiyalar sonlandırılsın?');
        if (!accepted) {
            return;
        }

        try {
            await logoutAllAdmin();
        } catch (error) {
            if (error instanceof Error) {
                window.alert(error.message);
            }
        } finally {
            router.push('/admin/login');
            router.refresh();
        }
    };

    const handleNotificationsOpenChange = (open: boolean) => {
        if (open) {
            setHasUnreadNotifications(false);
        }
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
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu onOpenChange={handleNotificationsOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-slate-500 hover:text-slate-700"
                            aria-label={t('notifications', { default: 'Notifications' })}
                        >
                            <Bell className="w-5 h-5" />
                            {hasUnreadNotifications ? (
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-orange rounded-full border border-white" />
                            ) : null}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="mt-2 w-80 p-0">
                        <div className="border-b border-slate-100 px-4 py-3">
                            <p className="text-sm font-semibold text-slate-900">
                                {t('notifications', { default: 'Notifications' })}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {t('notificationsDescription', {
                                    default: 'Recent admin updates and reminders are shown here.',
                                })}
                            </p>
                        </div>
                        <div className="max-h-80 space-y-2 overflow-y-auto p-2">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-3"
                                    >
                                        <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">{notification.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500">
                                    {t('notificationsEmpty', { default: 'There are no new notifications.' })}
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

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
                        <DropdownMenuItem
                            className="cursor-pointer text-slate-700 focus:text-slate-700"
                            onClick={handleLogoutAll}
                        >
                            {t('logoutAll', { default: 'Logout all sessions' })}
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
