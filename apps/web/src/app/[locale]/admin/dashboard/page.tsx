'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Inbox, Mail, Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/routing';
import {
    getAdminAppointmentRequests,
    getAdminContactMessages,
    type AdminAppointmentRequestRecord,
    type AdminContactMessageRecord,
} from '@/lib/admin-api';

function formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('az-AZ', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<AdminAppointmentRequestRecord[]>([]);
    const [messages, setMessages] = useState<AdminContactMessageRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const latestAppointments = useMemo(() => appointments.slice(0, 5), [appointments]);
    const latestMessages = useMemo(() => messages.slice(0, 5), [messages]);

    const loadData = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const [appointmentData, messageData] = await Promise.all([
                getAdminAppointmentRequests(50),
                getAdminContactMessages(50),
            ]);
            setAppointments(appointmentData);
            setMessages(messageData);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Dashboard məlumatları yüklənmədi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">Klinika idarəetmə panelinə xoş gəlmisiniz.</p>
                </div>
                <Button
                    variant="outline"
                    className="border-brand-blue text-brand-blue hover:bg-brand-blue-soft"
                    onClick={() => void loadData()}
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

            <div className="grid gap-6 xl:grid-cols-2">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Son qəbul müraciətləri</CardTitle>
                            <p className="text-sm text-slate-500">Ana səhifə formasından gələnlər.</p>
                        </div>
                        <Link href="/admin/appointments" className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
                            Hamısı
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((item) => (
                                    <Skeleton key={item} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : latestAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {latestAppointments.map((appointment) => (
                                    <div key={appointment.id} className="rounded-xl border border-slate-100 bg-white p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                    <CalendarCheck className="h-4 w-4 text-brand-blue" />
                                                    {appointment.fullName}
                                                </div>
                                                <p className="mt-1 text-sm text-slate-600">{appointment.serviceTitle}</p>
                                            </div>
                                            <span className="text-xs text-slate-500">{formatDateTime(appointment.createdAt)}</span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                            <span>{appointment.preferredDate} / {appointment.preferredTime}</span>
                                            <a href={`tel:${appointment.phone}`} className="flex items-center gap-1 hover:text-brand-blue">
                                                <Phone className="h-3.5 w-3.5" />
                                                {appointment.phone}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                Hələ qəbul müraciəti yoxdur.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Son kontakt mesajları</CardTitle>
                            <p className="text-sm text-slate-500">/contact səhifəsindən gələnlər.</p>
                        </div>
                        <Link href="/admin/messages" className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
                            Hamısı
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((item) => (
                                    <Skeleton key={item} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : latestMessages.length > 0 ? (
                            <div className="space-y-4">
                                {latestMessages.map((message) => (
                                    <div key={message.id} className="rounded-xl border border-slate-100 bg-white p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                    <Inbox className="h-4 w-4 text-brand-blue" />
                                                    {message.firstName} {message.lastName}
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-slate-700">{message.subject}</p>
                                            </div>
                                            <span className="text-xs text-slate-500">{formatDateTime(message.createdAt)}</span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                            <a href={`mailto:${message.email}`} className="flex items-center gap-1 hover:text-brand-blue">
                                                <Mail className="h-3.5 w-3.5" />
                                                {message.email}
                                            </a>
                                            <a href={`tel:${message.phone}`} className="flex items-center gap-1 hover:text-brand-blue">
                                                <Phone className="h-3.5 w-3.5" />
                                                {message.phone}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                Hələ kontakt mesajı yoxdur.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
