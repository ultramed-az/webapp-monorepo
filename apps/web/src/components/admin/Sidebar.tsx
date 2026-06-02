'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    FileText,
    Image as ImageIcon,
    HardDrive,
    MessageSquare,
    HelpCircle,
    Shield,
    ScrollText,
    Bell,
    ClipboardList,
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
        { icon: <Bell className="w-5 h-5" />, label: t('announcements', { default: 'Announcements' }), href: '/admin/announcements' },
        { icon: <ClipboardList className="w-5 h-5" />, label: t('checkupPackages', { default: 'Check-up Packages' }), href: '/admin/checkup-packages' },
        { icon: <Stethoscope className="w-5 h-5" />, label: t('services', { default: 'Services' }), href: '/admin/services' },
        { icon: <Users className="w-5 h-5" />, label: t('doctors', { default: 'Doctors' }), href: '/admin/doctors' },
        { icon: <FileText className="w-5 h-5" />, label: t('blog', { default: 'Blog' }), href: '/admin/blog' },
        { icon: <ImageIcon className="w-5 h-5" />, label: t('gallery', { default: 'Gallery' }), href: '/admin/gallery' },
        { icon: <HardDrive className="w-5 h-5" />, label: t('media', { default: 'Media' }), href: '/admin/media' },
        { icon: <MessageSquare className="w-5 h-5" />, label: t('testimonials', { default: 'Testimonials' }), href: '/admin/testimonials' },
        { icon: <HelpCircle className="w-5 h-5" />, label: t('faq', { default: 'FAQ' }), href: '/admin/faq' },
        { icon: <Shield className="w-5 h-5" />, label: t('privacyPolicy', { default: 'Privacy Policy' }), href: '/admin/privacy-policy' },
        { icon: <ScrollText className="w-5 h-5" />, label: t('terms', { default: 'Terms of Service' }), href: '/admin/terms-of-service' },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <aside
            className={cn(
                'bg-brand-blue-dark text-white/90 flex flex-col h-full transition-all duration-300 border-r border-white/15',
                mobile ? 'w-full' : 'w-72 hidden md:flex',
            )}
        >
            <div className="h-16 flex items-center px-6 border-b border-white/15">
                <Link href="/admin/dashboard" className="flex items-center" onClick={onNavigate}>
                    <Image
                        src="/logo.png"
                        alt="Ultramed"
                        width={130}
                        height={38}
                        className="h-8 w-auto"
                    />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="mb-4 px-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
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
                                    ? 'bg-brand-orange text-white'
                                    : 'hover:bg-brand-blue hover:text-white',
                            )}
                        >
                            <span className={cn(
                                isActive(item.href)
                                    ? 'text-white'
                                    : 'text-white/70 group-hover:text-white',
                            )}>
                                {item.icon}
                            </span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
