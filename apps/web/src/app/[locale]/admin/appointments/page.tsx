'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Mail, Phone, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import {
    deleteAdminAppointmentRequest,
    deleteAdminAppointmentRequests,
    getAdminAppointmentRequests,
    type AdminAppointmentRequestRecord,
} from '@/lib/admin-api';

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

function truncateText(value: string | null, maxLength = 96): string {
    const text = value?.trim();
    if (!text) {
        return 'Mesaj yoxdur';
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

function filterAppointments(items: AdminAppointmentRequestRecord[], searchTerm: string) {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
        return items;
    }

    return items.filter((item) => {
        const haystack = [
            item.fullName,
            item.email,
            item.phone,
            item.serviceTitle,
            item.preferredDate,
            item.preferredTime,
            item.message ?? '',
        ].join(' ').toLowerCase();

        return haystack.includes(normalized);
    });
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{value || '-'}</p>
        </div>
    );
}

export default function AppointmentsPage() {
    const [items, setItems] = useState<AdminAppointmentRequestRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeItem, setActiveItem] = useState<AdminAppointmentRequestRecord | null>(null);
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const filteredItems = useMemo(
        () => filterAppointments(items, searchTerm),
        [items, searchTerm],
    );
    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const filteredIds = useMemo(() => filteredItems.map((item) => item.id), [filteredItems]);
    const allFilteredSelected =
        filteredIds.length > 0 && filteredIds.every((id) => selectedIdSet.has(id));

    const loadItems = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const data = await getAdminAppointmentRequests();
            setItems(data);
            setSelectedIds([]);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Qəbul müraciətləri yüklənmədi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadItems();
    }, []);

    const removeItemsFromState = (ids: string[]) => {
        const idsToRemove = new Set(ids);
        setItems((current) => current.filter((item) => !idsToRemove.has(item.id)));
        setSelectedIds((current) => current.filter((id) => !idsToRemove.has(id)));
        setActiveItem((current) => (current && idsToRemove.has(current.id) ? null : current));
    };

    const toggleSelectAllFiltered = () => {
        if (allFilteredSelected) {
            setSelectedIds((current) => current.filter((id) => !filteredIds.includes(id)));
            return;
        }

        setSelectedIds((current) => Array.from(new Set([...current, ...filteredIds])));
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id],
        );
    };

    const handleDeleteOne = async (item: AdminAppointmentRequestRecord) => {
        const accepted = window.confirm(`"${item.fullName}" müraciəti silinsin?`);
        if (!accepted) {
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setDeletingIds([item.id]);

        try {
            await deleteAdminAppointmentRequest(item.id);
            removeItemsFromState([item.id]);
            setSuccessMessage('Müraciət silindi.');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Müraciət silinmədi.');
        } finally {
            setDeletingIds([]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            return;
        }

        const accepted = window.confirm(`${selectedIds.length} müraciət silinsin?`);
        if (!accepted) {
            return;
        }

        const idsToDelete = [...selectedIds];
        setErrorMessage(null);
        setSuccessMessage(null);
        setDeletingIds(idsToDelete);

        try {
            await deleteAdminAppointmentRequests(idsToDelete);
            removeItemsFromState(idsToDelete);
            setSuccessMessage('Seçilmiş müraciətlər silindi.');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Seçilmiş müraciətlər silinmədi.');
        } finally {
            setDeletingIds([]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Qəbullar</h2>
                    <p className="text-slate-500">Ana səhifədəki “Peşəkar məsləhət alın” formasından gələn müraciətlər.</p>
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
            {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {successMessage}
                </div>
            ) : null}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                        <div>
                            <CardTitle className="text-lg">Qəbul müraciətləri</CardTitle>
                            <CardDescription>
                                Cəmi: {items.length} müraciət, göstərilir: {filteredItems.length}
                            </CardDescription>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => void handleDeleteSelected()}
                                disabled={selectedIds.length === 0 || deletingIds.length > 0}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Seçilənləri sil ({selectedIds.length})
                            </Button>
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Ad, telefon, xidmət və ya tarix axtar..."
                                    className="h-9 pl-9"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
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
                        <div className="overflow-hidden rounded-md border border-slate-100">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-10">
                                            <input
                                                aria-label="Bütün müraciətləri seç"
                                                type="checkbox"
                                                checked={allFilteredSelected}
                                                onChange={toggleSelectAllFiltered}
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </TableHead>
                                        <TableHead>Pasiyent</TableHead>
                                        <TableHead>Xidmət</TableHead>
                                        <TableHead>İstənilən tarix/saat</TableHead>
                                        <TableHead>Mesaj</TableHead>
                                        <TableHead>Göndərilmə tarixi</TableHead>
                                        <TableHead className="w-20 text-right">Sil</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((appointment) => (
                                        <TableRow
                                            key={appointment.id}
                                            className="cursor-pointer transition-colors hover:bg-slate-50"
                                            onClick={() => setActiveItem(appointment)}
                                        >
                                            <TableCell onClick={(event) => event.stopPropagation()}>
                                                <input
                                                    aria-label={`${appointment.fullName} müraciətini seç`}
                                                    type="checkbox"
                                                    checked={selectedIdSet.has(appointment.id)}
                                                    onChange={() => toggleSelection(appointment.id)}
                                                    className="h-4 w-4 rounded border-slate-300"
                                                />
                                            </TableCell>
                                            <TableCell className="min-w-[220px]">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-900">{appointment.fullName}</span>
                                                    <a
                                                        href={`tel:${appointment.phone}`}
                                                        onClick={(event) => event.stopPropagation()}
                                                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-blue"
                                                    >
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {appointment.phone}
                                                    </a>
                                                    <a
                                                        href={`mailto:${appointment.email}`}
                                                        onClick={(event) => event.stopPropagation()}
                                                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-blue"
                                                    >
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {appointment.email}
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell className="min-w-[180px]">
                                                <div className="font-medium text-slate-800">{appointment.serviceTitle}</div>
                                                <div className="mt-1 text-xs text-slate-500">{appointment.source}</div>
                                            </TableCell>
                                            <TableCell className="min-w-[180px]">
                                                <div className="flex items-center gap-1 text-sm text-slate-700">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    {appointment.preferredDate}
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-900">
                                                    <Clock className="h-3.5 w-3.5 text-brand-blue" />
                                                    {appointment.preferredTime}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px] whitespace-normal text-sm text-slate-600">
                                                {truncateText(appointment.message)}
                                            </TableCell>
                                            <TableCell className="min-w-[150px] text-sm text-slate-500">
                                                {formatDateTime(appointment.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => void handleDeleteOne(appointment)}
                                                    disabled={deletingIds.includes(appointment.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Sil</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            {searchTerm ? 'Axtarışa uyğun müraciət tapılmadı.' : 'Hələ qəbul müraciəti yoxdur.'}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={Boolean(activeItem)} onOpenChange={(open) => !open && setActiveItem(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{activeItem?.fullName ?? 'Qəbul müraciəti'}</DialogTitle>
                        <DialogDescription>Qəbul müraciətinin tam detalları.</DialogDescription>
                    </DialogHeader>
                    {activeItem ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            <DetailField label="Telefon" value={activeItem.phone} />
                            <DetailField label="E-poçt" value={activeItem.email} />
                            <DetailField label="Xidmət" value={activeItem.serviceTitle} />
                            <DetailField label="Mənbə" value={activeItem.source} />
                            <DetailField label="İstənilən tarix" value={activeItem.preferredDate} />
                            <DetailField label="İstənilən saat" value={activeItem.preferredTime} />
                            <DetailField label="Göndərilmə tarixi" value={formatDateTime(activeItem.createdAt)} />
                            <DetailField label="Dil" value={activeItem.locale.toUpperCase()} />
                            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 md:col-span-2">
                                <p className="text-xs font-semibold uppercase text-slate-500">Mesaj</p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
                                    {activeItem.message || 'Mesaj yoxdur'}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}
