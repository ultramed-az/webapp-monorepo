'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import {
  AdminContentPageRecord,
  AdminContentSectionRecord,
  getAdminContentPage,
  updateAdminContentPage,
} from '@/lib/admin-api';

type FormState = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz: string;
  descriptionEn: string;
  descriptionRu: string;
  sectionsAz: string;
  sectionsEn: string;
  sectionsRu: string;
};

const EMPTY_FORM: FormState = {
  titleAz: '',
  titleEn: '',
  titleRu: '',
  descriptionAz: '',
  descriptionEn: '',
  descriptionRu: '',
  sectionsAz: '[]',
  sectionsEn: '[]',
  sectionsRu: '[]',
};

function stringifySections(value: AdminContentSectionRecord[] | null | undefined): string {
  return JSON.stringify(value ?? [], null, 2);
}

function parseSections(value: string): AdminContentSectionRecord[] {
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('Section JSON array formatında olmalıdır.');
  }

  return parsed.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error('Section item obyekt olmalıdır.');
    }

    const title = (item as { title?: unknown }).title;
    const content = (item as { content?: unknown }).content;
    if (typeof title !== 'string' || typeof content !== 'string') {
      throw new Error('Hər section üçün `title` və `content` string olmalıdır.');
    }

    return { title, content };
  });
}

function toFormState(page: AdminContentPageRecord): FormState {
  return {
    titleAz: page.titleAz,
    titleEn: page.titleEn,
    titleRu: page.titleRu,
    descriptionAz: page.descriptionAz,
    descriptionEn: page.descriptionEn,
    descriptionRu: page.descriptionRu,
    sectionsAz: stringifySections(page.sectionsAz),
    sectionsEn: stringifySections(page.sectionsEn),
    sectionsRu: stringifySections(page.sectionsRu),
  };
}

export default function AdminTermsPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadPage = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const page = await getAdminContentPage('terms-of-service');
      if (!page) {
        throw new Error('terms-of-service content tapılmadı.');
      }
      setForm(toFormState(page));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Məzmun yüklənmədi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPage();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const sectionsAz = parseSections(form.sectionsAz);
      const sectionsEn = parseSections(form.sectionsEn);
      const sectionsRu = parseSections(form.sectionsRu);

      await updateAdminContentPage('terms-of-service', {
        titleAz: form.titleAz.trim(),
        titleEn: form.titleEn.trim() || form.titleAz.trim(),
        titleRu: form.titleRu.trim() || form.titleAz.trim(),
        descriptionAz: form.descriptionAz.trim(),
        descriptionEn: form.descriptionEn.trim() || form.descriptionAz.trim(),
        descriptionRu: form.descriptionRu.trim() || form.descriptionAz.trim(),
        sectionsAz,
        sectionsEn,
        sectionsRu,
      });

      setSuccessMessage('İstifadə şərtləri yeniləndi.');
      await loadPage();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Yadda saxlama zamanı xəta baş verdi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">İstifadə Şərtləri (Admin)</h2>
        <p className="text-slate-500">İstifadə şərtləri məzmununun idarə edilməsi.</p>
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
          <CardTitle>Mətn Redaktoru</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Title AZ"
                  value={form.titleAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, titleAz: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Title EN"
                  value={form.titleEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, titleEn: event.target.value }))}
                />
                <Input
                  placeholder="Title RU"
                  value={form.titleRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, titleRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-24"
                  placeholder="Description AZ"
                  value={form.descriptionAz}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, descriptionAz: event.target.value }))
                  }
                  required
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Description EN"
                  value={form.descriptionEn}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, descriptionEn: event.target.value }))
                  }
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Description RU"
                  value={form.descriptionRu}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, descriptionRu: event.target.value }))
                  }
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-[320px] font-mono text-xs"
                  placeholder="sectionsAz JSON"
                  value={form.sectionsAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, sectionsAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-[320px] font-mono text-xs"
                  placeholder="sectionsEn JSON"
                  value={form.sectionsEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, sectionsEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-[320px] font-mono text-xs"
                  placeholder="sectionsRu JSON"
                  value={form.sectionsRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, sectionsRu: event.target.value }))}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Dəyişiklikləri Yadda Saxla
                </Button>
                <Button type="button" variant="outline" onClick={() => void loadPage()}>
                  Yenilə
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
