'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    FileText,
    Image as ImageIcon,
    MessageSquare,
    HelpCircle,
    Shield,
    ScrollText,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarProps = {
    mobile?: boolean;
    onNavigate?: () => void;
};

export default function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
    const t = useTranslations('Admin');
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: t('dashboard', { default: 'Dashboard' }), href: '/admin/dashboard' },
        { icon: <Stethoscope className="w-5 h-5" />, label: t('services', { default: 'Services' }), href: '/admin/services' },
        { icon: <Users className="w-5 h-5" />, label: t('doctors', { default: 'Doctors' }), href: '/admin/doctors' },
        { icon: <FileText className="w-5 h-5" />, label: t('blog', { default: 'Blog' }), href: '/admin/blog' },
        { icon: <ImageIcon className="w-5 h-5" />, label: t('gallery', { default: 'Gallery' }), href: '/admin/gallery' },
        { icon: <MessageSquare className="w-5 h-5" />, label: t('testimonials', { default: 'Testimonials' }), href: '/admin/testimonials' },
        { icon: <HelpCircle className="w-5 h-5" />, label: t('faq', { default: 'FAQ' }), href: '/admin/faq' },
        { icon: <Shield className="w-5 h-5" />, label: t('privacyPolicy', { default: 'Privacy Policy' }), href: '/admin/privacy-policy' },
        { icon: <ScrollText className="w-5 h-5" />, label: t('terms', { default: 'Terms of Service' }), href: '/admin/terms-of-service' },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <aside
            className={cn(
                'bg-slate-900 text-slate-300 flex flex-col h-full transition-all duration-300 border-r border-slate-800',
                mobile ? 'w-full' : 'w-72 hidden md:flex',
            )}
        >
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Ultramed <span className="text-blue-500 text-sm font-medium">Admin</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="mb-4 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t('menu', { default: 'Menu' })}
                </div>
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                                isActive(item.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-slate-800 hover:text-white',
                            )}
                        >
                            <span className={cn(
                                isActive(item.href)
                                    ? 'text-white'
                                    : 'text-slate-400 group-hover:text-white',
                            )}>
                                {item.icon}
                            </span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors group">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">{t('logout', { default: 'Logout' })}</span>
                </button>
            </div>
        </aside>
    );
}
