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
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, ShieldCheck, Activity, Stethoscope } from 'lucide-react';

// Mock data
const initialServices = [
    { id: 1, nameAz: 'Kardiologiya', nameEn: 'Cardiology', icon: 'HeartPulse', status: 'active', doctorsCount: 4 },
    { id: 2, nameAz: 'Nevrologiya', nameEn: 'Neurology', icon: 'Activity', status: 'active', doctorsCount: 3 },
    { id: 3, nameAz: 'Stomatologiya', nameEn: 'Dentistry', icon: 'ShieldCheck', status: 'inactive', doctorsCount: 0 },
    { id: 4, nameAz: 'Laboratoriya', nameEn: 'Laboratory', icon: 'Stethoscope', status: 'active', doctorsCount: 12 },
];

export default function ServicesPage() {
    const t = useTranslations('Admin');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Xidmətlər (Şöbələr)</h2>
                    <p className="text-slate-500">Klinika daxili bütün tibbi xidmətləri idarə edin.</p>
                </div>
                <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Yeni Xidmət Əlavə Et
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Xidmət Siyahısı</CardTitle>
                            <CardDescription>Cəmi: {initialServices.length} xidmət növü tapıldı</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Xidmət axtar..."
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
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Ad (AZ)</TableHead>
                                    <TableHead>Ad (EN)</TableHead>
                                    <TableHead>Həkim Sayı</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Əməliyyat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialServices.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium text-slate-500">#{service.id}</TableCell>
                                        <TableCell className="font-semibold text-slate-900">{service.nameAz}</TableCell>
                                        <TableCell className="text-slate-500">{service.nameEn}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                                                {service.doctorsCount} Həkim
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'active'
                                                    ? 'bg-brand-blue-soft text-brand-blue border border-brand-blue/20'
                                                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                                                }`}>
                                                {service.status === 'active' ? 'Aktiv' : 'Passiv'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Menyu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <FileEdit className="mr-2 h-4 w-4" />
                                                        <span>Redaktə Et</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Sil</span>
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
