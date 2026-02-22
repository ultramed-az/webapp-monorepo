'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';
import Image from 'next/image';

const initialPosts = [
    {
        id: 1,
        title: 'Ürək sağlamlığı üçün 5 qızıl qayda',
        author: 'Dr. Əli Vəliyev',
        category: 'Kardiologiya',
        date: '2024-03-14',
        views: 1245,
        status: 'published',
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Bahar aylarında allergiyadan necə qorunmalı?',
        author: 'Dr. Famil Abbasov',
        category: 'Terapiya',
        date: '2024-03-10',
        views: 856,
        status: 'published',
        image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Uşaqlarda diş kariesinin yaranma səbəbləri',
        author: 'Dr. Rəşad Hüseynov',
        category: 'Stomatologiya',
        date: '2024-03-05',
        views: 0,
        status: 'draft',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'Sağlam qidalanmanın əsasları nədir?',
        author: 'Dr. Leyla Quliyeva',
        category: 'Dietologiya',
        date: '2024-02-28',
        views: 2314,
        status: 'published',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop'
    },
];

export default function BlogPage() {
    const t = useTranslations('Admin');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bloq İdarəetməsi</h2>
                    <p className="text-slate-500">Məqalələr, məsləhətlər və xəbərləri buradan idarə edin.</p>
                </div>
                <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Yeni Məqalə Yaz
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Məqalələrin Siyahısı</CardTitle>
                            <CardDescription>Sistemdə ümumi {initialPosts.length} məqalə mövcuddur</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Başlıq və ya müəllif axtar..."
                                className="pl-9 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-100 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Məqalə</TableHead>
                                    <TableHead>Məlumat</TableHead>
                                    <TableHead>Müəllif & Kateqoriya</TableHead>
                                    <TableHead>Statistika</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Əməliyyat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialPosts.map((post) => (
                                    <TableRow key={post.id} className="group">
                                        <TableCell>
                                            <div className="h-12 w-16 relative rounded overflow-hidden border border-slate-200">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[250px]">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 truncate" title={post.title}>{post.title}</span>
                                                <span className="text-xs text-slate-500 mt-1 flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {post.date}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-sm font-medium text-slate-700">
                                                    <User className="w-3.5 h-3.5 mr-1.5 text-brand-blue" />
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Tag className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                                    {post.category}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-sm font-medium text-slate-600">
                                                <Eye className="w-4 h-4 mr-1.5 text-slate-400" />
                                                {post.views > 0 ? post.views.toLocaleString() : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${post.status === 'published' ? 'bg-brand-blue-soft text-brand-blue border-brand-blue/20' :
                                                    'bg-brand-orange/15 text-brand-orange-dark border-brand-orange/25'
                                                }`}>
                                                {post.status === 'published' ? 'Paylaşılıb' : 'Qaralama'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-blue hover:text-brand-blue hover:bg-brand-blue-soft">
                                                    <FileEdit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 sm:hidden">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <FileEdit className="mr-2 h-4 w-4" />
                                                        <span>Redaktə Et</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Məqaləni Sil</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
