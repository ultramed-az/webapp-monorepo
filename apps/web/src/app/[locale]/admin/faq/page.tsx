'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { FileEdit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import {
  type AdminFaqRecord,
  createAdminFaq,
  deleteAdminFaq,
  getAdminFaqs,
  updateAdminFaq,
} from '@/lib/admin-api';

type FormState = {
  questionAz: string;
  questionEn: string;
  questionRu: string;
  answerAz: string;
  answerEn: string;
  answerRu: string;
};

const EMPTY_FORM: FormState = {
  questionAz: '',
  questionEn: '',
  questionRu: '',
  answerAz: '',
  answerEn: '',
  answerRu: '',
};

function toFormState(item: AdminFaqRecord): FormState {
  return {
    questionAz: item.questionAz,
    questionEn: item.questionEn,
    questionRu: item.questionRu,
    answerAz: item.answerAz,
    answerEn: item.answerEn,
    answerRu: item.answerRu,
  };
}

export default function AdminFaqPage() {
  const [items, setItems] = useState<AdminFaqRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminFaqRecord | null>(null);
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
      [
        item.questionAz,
        item.questionEn,
        item.questionRu,
        item.answerAz,
        item.answerEn,
        item.answerRu,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, searchTerm]);

  const loadItems = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminFaqs();
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'FAQ məlumatları yüklənmədi.');
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

  const openEditDialog = (item: AdminFaqRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminFaqRecord) => {
    const accepted = window.confirm('Bu FAQ elementi silinsin?');
    if (!accepted) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminFaq(item.id);
      setSuccessMessage('FAQ elementi silindi.');
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'FAQ elementi silinmədi.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const questionAz = form.questionAz.trim();
    const answerAz = form.answerAz.trim();

    if (!questionAz || !answerAz) {
      setSubmitting(false);
      setErrorMessage('AZ sual və AZ cavab boş ola bilməz.');
      return;
    }

    const payload: Partial<AdminFaqRecord> = {
      questionAz,
      questionEn: form.questionEn.trim() || questionAz,
      questionRu: form.questionRu.trim() || questionAz,
      answerAz,
      answerEn: form.answerEn.trim() || answerAz,
      answerRu: form.answerRu.trim() || answerAz,
    };

    try {
      if (editingItem) {
        await updateAdminFaq(editingItem.id, payload);
        setSuccessMessage('FAQ elementi yeniləndi.');
      } else {
        await createAdminFaq(payload);
        setSuccessMessage('FAQ elementi yaradıldı.');
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">FAQ İdarəetməsi</h2>
          <p className="text-slate-500">FAQ bölməsi backend CRUD ilə idarə olunur.</p>
        </div>
        <Button
          className="bg-brand-orange hover:bg-brand-orange-dark text-white"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni FAQ
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
            <CardTitle>FAQ Siyahısı</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="FAQ axtar..."
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
              <Skeleton key={String(index)} className="h-32 w-full" />
            ))
          ) : filteredItems.length === 0 ? (
            <div className="rounded-lg border border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              Nəticə tapılmadı.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900">{item.questionAz}</h3>
                    <p className="text-sm text-slate-600">{item.answerAz}</p>
                  </div>
                  <Badge variant="secondary" className="bg-brand-blue-soft text-brand-blue">
                    FAQ
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(item)}
                    type="button"
                  >
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'FAQ redaktə et' : 'Yeni FAQ yarat'}</DialogTitle>
            <DialogDescription>
              FAQ məlumatları AZ/EN/RU formatında saxlanılır.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Sual AZ"
                  value={form.questionAz}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, questionAz: event.target.value }))
                  }
                  required
                />
                <Input
                  placeholder="Question EN"
                  value={form.questionEn}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, questionEn: event.target.value }))
                  }
                />
                <Input
                  placeholder="Вопрос RU"
                  value={form.questionRu}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, questionRu: event.target.value }))
                  }
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-28"
                  placeholder="Cavab AZ"
                  value={form.answerAz}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, answerAz: event.target.value }))
                  }
                  required
                />
                <Textarea
                  className="min-h-28"
                  placeholder="Answer EN"
                  value={form.answerEn}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, answerEn: event.target.value }))
                  }
                />
                <Textarea
                  className="min-h-28"
                  placeholder="Ответ RU"
                  value={form.answerRu}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, answerRu: event.target.value }))
                  }
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
