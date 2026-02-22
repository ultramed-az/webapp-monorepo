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
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, Filter } from 'lucide-react';
import Image from 'next/image';

// Mock data
const initialDoctors = [
    { id: 1, name: 'Dr. Əli Vəliyev', department: 'Kardiologiya', experience: '15 il', status: 'active', email: 'ali.v@ultramed.az' },
    { id: 2, name: 'Dr. Aysel Məmmədova', department: 'Nevrologiya', experience: '8 il', status: 'active', email: 'aysel.m@ultramed.az' },
    { id: 3, name: 'Dr. Rəşad Hüseynov', department: 'Stomatologiya', experience: '12 il', status: 'on_leave', email: 'rashad.h@ultramed.az' },
    { id: 4, name: 'Dr. Leyla Quliyeva', department: 'Laboratoriya', experience: '5 il', status: 'active', email: 'leyla.q@ultramed.az' },
    { id: 5, name: 'Dr. Samir Əliyev', department: 'Kardiologiya', experience: '20 il', status: 'inactive', email: 'samir.a@ultramed.az' },
];

export default function DoctorsPage() {
    const t = useTranslations('Admin');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Həkimlər</h2>
                    <p className="text-slate-500">Klinika həkimlərinin siyahısı və məlumatlarının idarə edilməsi.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Yeni Həkim Əlavə Et
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Həkimlərin Siyahısı</CardTitle>
                            <CardDescription>Cəmi {initialDoctors.length} həkim qeydiyyatdan keçib.</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Həkim axtar..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 text-slate-500">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-100 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Məlumat</TableHead>
                                    <TableHead>Şöbə</TableHead>
                                    <TableHead>Əlaqə</TableHead>
                                    <TableHead>Təcrübə</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Əməliyyat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialDoctors.map((doctor) => (
                                    <TableRow key={doctor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden border border-blue-200">
                                                    {doctor.name.split(' ')[1]?.[0] || 'D'}{doctor.name.split(' ')[2]?.[0] || ''}
                                                </div>
                                                <div className="flex flex-col whitespace-nowrap">
                                                    <span className="font-semibold text-slate-900">{doctor.name}</span>
                                                    <span className="text-xs text-slate-500">ID: DOC-{1000 + doctor.id}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                                                {doctor.department}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {doctor.email}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-slate-700">
                                            {doctor.experience}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                    : doctor.status === 'on_leave'
                                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                                                }`}>
                                                {doctor.status === 'active' ? 'Aktiv' : doctor.status === 'on_leave' ? 'Məzuniyyət' : 'İşdən ayrılıb'}
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
                                                        <span>Sistemdən Sil</span>
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
