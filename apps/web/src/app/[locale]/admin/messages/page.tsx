'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, RefreshCw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getAdminContactMessages, type AdminContactMessageRecord } from '@/lib/admin-api';

function formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('az-AZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function filterMessages(items: AdminContactMessageRecord[], searchTerm: string) {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
        return items;
    }

    return items.filter((item) => {
        const haystack = [
            item.firstName,
            item.lastName,
            item.email,
            item.phone,
            item.subject,
            item.message,
            item.status,
        ].join(' ').toLowerCase();

        return haystack.includes(normalized);
    });
}

export default function AdminMessagesPage() {
    const [items, setItems] = useState<AdminContactMessageRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const filteredItems = useMemo(
        () => filterMessages(items, searchTerm),
        [items, searchTerm],
    );

    const loadItems = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const data = await getAdminContactMessages();
            setItems(data);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Mesajlar yüklənmədi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadItems();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mesajlar</h2>
                    <p className="text-slate-500">/contact səhifəsindəki “Bizə Yazın” formasından gələn mesajlar.</p>
                </div>
                <Button
                    variant="outline"
                    className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                    onClick={() => void loadItems()}
                    disabled={loading}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Yenilə
                </Button>
            </div>

            {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                </div>
            ) : null}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <CardTitle className="text-lg">Kontakt mesajları</CardTitle>
                            <CardDescription>
                                Cəmi: {items.length} mesaj, göstərilir: {filteredItems.length}
                            </CardDescription>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Ad, telefon, mövzu və ya mesaj axtar..."
                                className="h-9 pl-9"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((item) => (
                                <Skeleton key={item} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="rounded-md border border-slate-100">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Göndərən</TableHead>
                                        <TableHead>Mövzu</TableHead>
                                        <TableHead>Mesaj</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Göndərilmə tarixi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((message) => (
                                        <TableRow key={message.id}>
                                            <TableCell className="min-w-[220px]">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-900">
                                                        {message.firstName} {message.lastName}
                                                    </span>
                                                    <a href={`tel:${message.phone}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-blue">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {message.phone}
                                                    </a>
                                                    <a href={`mailto:${message.email}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-blue">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {message.email}
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell className="min-w-[180px] font-medium text-slate-800">
                                                {message.subject}
                                            </TableCell>
                                            <TableCell className="max-w-[420px] whitespace-normal text-sm leading-6 text-slate-600">
                                                {message.message}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="border-brand-orange/25 bg-brand-orange/15 text-brand-orange-dark">
                                                    {message.status === 'new' ? 'Yeni' : message.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="min-w-[150px] text-sm text-slate-500">
                                                {formatDateTime(message.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            {searchTerm ? 'Axtarışa uyğun mesaj tapılmadı.' : 'Hələ kontakt mesajı yoxdur.'}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
