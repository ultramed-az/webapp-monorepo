'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FileEdit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import {
  AdminTestimonialRecord,
  createAdminTestimonial,
  deleteAdminTestimonial,
  getAdminTestimonials,
  updateAdminTestimonial,
} from '@/lib/admin-api';

type FormState = {
  name: string;
  roleAz: string;
  roleEn: string;
  roleRu: string;
  commentAz: string;
  commentEn: string;
  commentRu: string;
  rating: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  roleAz: '',
  roleEn: '',
  roleRu: '',
  commentAz: '',
  commentEn: '',
  commentRu: '',
  rating: '5',
};

function toFormState(record: AdminTestimonialRecord): FormState {
  return {
    name: record.name,
    roleAz: record.roleAz ?? '',
    roleEn: record.roleEn ?? '',
    roleRu: record.roleRu ?? '',
    commentAz: record.commentAz,
    commentEn: record.commentEn,
    commentRu: record.commentRu,
    rating: String(record.rating ?? 5),
  };
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminTestimonialRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) {
      return items;
    }

    return items.filter((item) =>
      [item.name, item.roleAz ?? '', item.commentAz].join(' ').toLowerCase().includes(needle),
    );
  }, [items, searchTerm]);

  const loadItems = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getAdminTestimonials();
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Rəylər yüklənmədi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (item: AdminTestimonialRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminTestimonialRecord) => {
    const accepted = window.confirm(`"${item.name}" rəyi silinsin?`);
    if (!accepted) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminTestimonial(item.id);
      setSuccessMessage('Rəy silindi.');
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Rəy silinmədi.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const name = form.name.trim();
    const commentAz = form.commentAz.trim();

    if (!name || !commentAz) {
      setSubmitting(false);
      setErrorMessage('Ad və AZ şərh boş ola bilməz.');
      return;
    }

    const numericRating = Math.min(5, Math.max(1, Number.parseInt(form.rating, 10) || 5));

    const payload: Partial<AdminTestimonialRecord> = {
      name,
      roleAz: form.roleAz.trim() || null,
      roleEn: form.roleEn.trim() || null,
      roleRu: form.roleRu.trim() || null,
      commentAz,
      commentEn: form.commentEn.trim() || commentAz,
      commentRu: form.commentRu.trim() || commentAz,
      rating: numericRating,
    };

    try {
      if (editingItem) {
        await updateAdminTestimonial(editingItem.id, payload);
        setSuccessMessage('Rəy yeniləndi.');
      } else {
        await createAdminTestimonial(payload);
        setSuccessMessage('Rəy yaradıldı.');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Rəylər İdarəetməsi</h2>
          <p className="text-slate-500">Pasiyent rəyləri backend CRUD ilə idarə olunur.</p>
        </div>
        <Button
          className="bg-brand-orange hover:bg-brand-orange-dark text-white"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Rəy
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

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle>Rəy Siyahısı</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rəy axtar..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={String(index)} className="h-28 w-full" />
            ))
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500">{item.roleAz ?? '-'}</p>
                  </div>
                  <Badge variant="secondary" className="bg-brand-blue-soft text-brand-blue">
                    {item.rating}/5
                  </Badge>
                </div>
                <p className="text-slate-700 mb-3">{item.commentAz}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(item)} type="button">
                    <FileEdit className="h-4 w-4 mr-1" />
                    Redaktə et
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => void handleDelete(item)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Sil
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Rəyi redaktə et' : 'Yeni rəy yarat'}</DialogTitle>
            <DialogDescription>
              Rəylər AZ/EN/RU formatında saxlanılır.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Ad Soyad"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Rating (1-5)"
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Rol AZ"
                  value={form.roleAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, roleAz: event.target.value }))}
                />
                <Input
                  placeholder="Role EN"
                  value={form.roleEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, roleEn: event.target.value }))}
                />
                <Input
                  placeholder="Роль RU"
                  value={form.roleRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, roleRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-28"
                  placeholder="Şərh AZ"
                  value={form.commentAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, commentAz: event.target.value }))}
                  required
                />
                <Textarea
                  className="min-h-28"
                  placeholder="Comment EN"
                  value={form.commentEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, commentEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-28"
                  placeholder="Комментарий RU"
                  value={form.commentRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, commentRu: event.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Ləğv et
              </Button>
              <Button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-dark text-white"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingItem ? 'Yenilə' : 'Yarat'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
