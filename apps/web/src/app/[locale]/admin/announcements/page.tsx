'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bell, FileEdit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  type AdminAnnouncementRecord,
  createAdminAnnouncement,
  deleteAdminAnnouncement,
  getAdminAnnouncements,
  updateAdminAnnouncement,
} from '@/lib/admin-api';

type FormState = {
  textAz: string;
  textEn: string;
  textRu: string;
  href: string;
  sortOrder: string;
  isPublished: 'true' | 'false';
};

const EMPTY_FORM: FormState = {
  textAz: '',
  textEn: '',
  textRu: '',
  href: '',
  sortOrder: '0',
  isPublished: 'true',
};

function toFormState(record: AdminAnnouncementRecord): FormState {
  return {
    textAz: record.textAz,
    textEn: record.textEn,
    textRu: record.textRu,
    href: record.href ?? '',
    sortOrder: String(record.sortOrder ?? 0),
    isPublished: record.isPublished ? 'true' : 'false',
  };
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<AdminAnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminAnnouncementRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return items;

    return items.filter((item) =>
      [item.textAz, item.textEn, item.textRu, item.href ?? '']
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, searchTerm]);

  const loadItems = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      setItems(await getAdminAnnouncements());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Elanlar yüklənmədi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setErrorMessage(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: AdminAnnouncementRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setErrorMessage(null);
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminAnnouncementRecord) => {
    if (!window.confirm('Bu elan silinsin?')) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await deleteAdminAnnouncement(item.id);
      setSuccessMessage('Elan silindi.');
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Elan silinmədi.');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const textAz = form.textAz.trim();
    if (!textAz) {
      setSubmitting(false);
      setErrorMessage('AZ mətn boş ola bilməz.');
      return;
    }

    const payload = {
      textAz,
      textEn: form.textEn.trim() || textAz,
      textRu: form.textRu.trim() || textAz,
      href: form.href.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isPublished: form.isPublished === 'true',
    };

    try {
      if (editingItem) {
        await updateAdminAnnouncement(editingItem.id, payload);
        setSuccessMessage('Elan yeniləndi.');
      } else {
        await createAdminAnnouncement(payload);
        setSuccessMessage('Elan yaradıldı.');
      }
      setDialogOpen(false);
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Əməliyyat uğursuz oldu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ana səhifə elanları</h2>
          <p className="text-slate-500">Üst announcement lentində axan mətnləri idarə edin.</p>
        </div>
        <Button className="bg-brand-orange text-white hover:bg-brand-orange-dark" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni elan
        </Button>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-blue" />
              Elanlar
            </CardTitle>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Mətn üzrə axtar..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">AZ mətn</th>
                    <th className="px-3 py-3">Link</th>
                    <th className="px-3 py-3">Sıra</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="max-w-md px-3 py-4 font-medium text-slate-900">{item.textAz}</td>
                      <td className="px-3 py-4 text-slate-500">{item.href ?? '-'}</td>
                      <td className="px-3 py-4 text-slate-500">{item.sortOrder}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {item.isPublished ? 'Aktiv' : 'Gizli'}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => void handleDelete(item)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">Elan tapılmadı.</div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Elanı redaktə et' : 'Yeni elan'}</DialogTitle>
            <DialogDescription>Announcement lentində görünəcək mətni və statusu daxil edin.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Textarea
              placeholder="Mətn AZ"
              value={form.textAz}
              onChange={(event) => setForm((prev) => ({ ...prev, textAz: event.target.value }))}
            />
            <Textarea
              placeholder="Mətn EN"
              value={form.textEn}
              onChange={(event) => setForm((prev) => ({ ...prev, textEn: event.target.value }))}
            />
            <Textarea
              placeholder="Mətn RU"
              value={form.textRu}
              onChange={(event) => setForm((prev) => ({ ...prev, textRu: event.target.value }))}
            />
            <Input
              placeholder="Link (istəyə bağlı)"
              value={form.href}
              onChange={(event) => setForm((prev) => ({ ...prev, href: event.target.value }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="number"
                placeholder="Sıra"
                value={form.sortOrder}
                onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
              />
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.isPublished}
                onChange={(event) => setForm((prev) => ({ ...prev, isPublished: event.target.value as 'true' | 'false' }))}
              >
                <option value="true">Aktiv</option>
                <option value="false">Gizli</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Bağla
              </Button>
              <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange-dark" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Yadda saxla
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
