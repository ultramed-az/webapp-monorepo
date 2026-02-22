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
import { Plus, Search, MoreHorizontal, CheckCircle2, XCircle, Calendar, Clock } from 'lucide-react';

const initialAppointments = [
    { id: '1001', patient: 'Aygün Həsənova', doctor: 'Dr. Əli Vəliyev', department: 'Kardiologiya', date: '2024-03-15', time: '14:30', status: 'pending', phone: '+994 50 123 45 67' },
    { id: '1002', patient: 'Samir Məmmədov', doctor: 'Dr. Aysel Məmmədova', department: 'Nevrologiya', date: '2024-03-15', time: '15:00', status: 'confirmed', phone: '+994 55 987 65 43' },
    { id: '1003', patient: 'Leyla Əliyeva', doctor: 'Dr. Rəşad Hüseynov', department: 'Stomatologiya', date: '2024-03-16', time: '10:00', status: 'cancelled', phone: '+994 70 456 78 90' },
    { id: '1004', patient: 'Rəsul Qarayev', doctor: 'Dr. Rəhman Qasımlı', department: 'Oftalmologiya', date: '2024-03-16', time: '11:15', status: 'completed', phone: '+994 51 234 56 78' },
    { id: '1005', patient: 'Nəzrin Babayeva', doctor: 'Dr. Nərmin Abbasova', department: 'Ginekologiya', date: '2024-03-17', time: '09:30', status: 'pending', phone: '+994 50 876 54 32' },
];

export default function AppointmentsPage() {
    const t = useTranslations('Admin');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Qəbullar (Appointments)</h2>
                    <p className="text-slate-500">Pasiyentlərin həkim qəbullarını idarə edin.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Yeni Qəbul Yarat
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Qəbul Siyahısı</CardTitle>
                            <CardDescription>Cəmi: {initialAppointments.length} qəbul tapıldı</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Pasiyent adı, nömrə və ya həkim..."
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
                                    <TableHead>Pasiyent</TableHead>
                                    <TableHead>Həkim / Şöbə</TableHead>
                                    <TableHead>Tarix / Saat</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Əməliyyat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialAppointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell className="font-medium text-slate-500">#{appointment.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{appointment.patient}</span>
                                                <span className="text-xs text-slate-500">{appointment.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700">{appointment.doctor}</span>
                                                <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-semibold mt-0.5">
                                                    {appointment.department}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-sm text-slate-700">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                                    {appointment.date}
                                                </div>
                                                <div className="flex items-center text-sm font-medium text-slate-900">
                                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                                    {appointment.time}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${appointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    appointment.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {appointment.status === 'confirmed' ? 'Təsdiqlənib' :
                                                    appointment.status === 'completed' ? 'Tamamlanıb' :
                                                        appointment.status === 'cancelled' ? 'Ləğv edilib' :
                                                            'Gözləyir'}
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
                                                    <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50">
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        <span>Təsdiqlə</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        <span>Ləğv Et</span>
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
