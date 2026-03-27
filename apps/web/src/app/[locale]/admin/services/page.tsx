'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Search,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Loader2,
  Upload,
} from 'lucide-react';
import {
  AdminMediaRecord,
  AdminServiceRecord,
  createAdminService,
  deleteAdminService,
  getAdminMedia,
  getAdminServices,
  updateAdminService,
  uploadAdminMedia,
} from '@/lib/admin-api';

type FormState = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  summaryAz: string;
  summaryEn: string;
  summaryRu: string;
  contentAz: string;
  contentEn: string;
  contentRu: string;
  highlightsAz: string;
  highlightsEn: string;
  highlightsRu: string;
  iconKey: string;
  image: string;
  mediaId: string;
  sortOrder: string;
  isPublished: 'true' | 'false';
};

const EMPTY_FORM: FormState = {
  titleAz: '',
  titleEn: '',
  titleRu: '',
  summaryAz: '',
  summaryEn: '',
  summaryRu: '',
  contentAz: '',
  contentEn: '',
  contentRu: '',
  highlightsAz: '',
  highlightsEn: '',
  highlightsRu: '',
  iconKey: '',
  image: '',
  mediaId: '',
  sortOrder: '0',
  isPublished: 'true',
};

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function toLines(value: unknown): string {
  if (!Array.isArray(value)) {
    return '';
  }

  return value.filter((item): item is string => typeof item === 'string').join('\n');
}

function toFormState(record: AdminServiceRecord): FormState {
  return {
    titleAz: record.titleAz,
    titleEn: record.titleEn,
    titleRu: record.titleRu,
    summaryAz: record.summaryAz,
    summaryEn: record.summaryEn,
    summaryRu: record.summaryRu,
    contentAz: record.contentAz,
    contentEn: record.contentEn,
    contentRu: record.contentRu,
    highlightsAz: toLines(record.highlightsAz),
    highlightsEn: toLines(record.highlightsEn),
    highlightsRu: toLines(record.highlightsRu),
    iconKey: record.iconKey ?? '',
    image: record.image ?? '',
    mediaId: record.mediaId ?? record.media?.id ?? '',
    sortOrder: String(record.sortOrder ?? 0),
    isPublished: record.isPublished ? 'true' : 'false',
  };
}

export default function ServicesPage() {
  const [items, setItems] = useState<AdminServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminServiceRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [mediaLibrary, setMediaLibrary] = useState<AdminMediaRecord[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) {
      return items;
    }

    return items.filter((item) =>
      [item.titleAz, item.titleEn, item.titleRu]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, searchTerm]);

  const selectedMedia = useMemo(
    () => mediaLibrary.find((media) => media.id === form.mediaId) ?? null,
    [form.mediaId, mediaLibrary],
  );

  const loadServices = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getAdminServices();
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Xidmətlər yüklənmədi.');
    } finally {
      setLoading(false);
    }
  };

  const loadMedia = async () => {
    try {
      const data = await getAdminMedia(100);
      setMediaLibrary(data);
    } catch {
      // Keep form usable even if media list request fails.
    }
  };

  useEffect(() => {
    void loadServices();
    void loadMedia();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: AdminServiceRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setErrorMessage(null);
    setSuccessMessage(null);
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminServiceRecord) => {
    const accepted = window.confirm(
      `"${item.titleAz}" xidmətini silmək istədiyinizə əminsiniz?`,
    );
    if (!accepted) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminService(item.id);
      setSuccessMessage('Xidmət silindi.');
      await loadServices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Xidmət silinmədi.');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const media = await uploadAdminMedia(file);
      setForm((prev) => ({ ...prev, image: media.url, mediaId: media.id }));
      setSuccessMessage('Şəkil yükləndi və media seçildi.');
      await loadMedia();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Şəkil yüklənmədi.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleMediaSelect = (value: string) => {
    if (!value) {
      setForm((prev) => ({ ...prev, mediaId: '' }));
      return;
    }

    const media = mediaLibrary.find((item) => item.id === value);
    if (!media) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      mediaId: media.id,
      image: media.cdnUrl,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const titleAz = form.titleAz.trim();
    const summaryAz = form.summaryAz.trim();
    const contentAz = form.contentAz.trim();

    if (!titleAz || !summaryAz || !contentAz) {
      setSubmitting(false);
      setErrorMessage('AZ başlıq, qısa məzmun və əsas məzmun boş ola bilməz.');
      return;
    }

    const highlightsAz = splitLines(form.highlightsAz);
    const highlightsEn = splitLines(form.highlightsEn);
    const highlightsRu = splitLines(form.highlightsRu);

    const payload: Partial<AdminServiceRecord> = {
      titleAz,
      titleEn: form.titleEn.trim() || titleAz,
      titleRu: form.titleRu.trim() || titleAz,
      summaryAz,
      summaryEn: form.summaryEn.trim() || summaryAz,
      summaryRu: form.summaryRu.trim() || summaryAz,
      contentAz,
      contentEn: form.contentEn.trim() || contentAz,
      contentRu: form.contentRu.trim() || contentAz,
      highlightsAz: highlightsAz.length > 0 ? highlightsAz : null,
      highlightsEn: highlightsEn.length > 0 ? highlightsEn : null,
      highlightsRu: highlightsRu.length > 0 ? highlightsRu : null,
      iconKey: form.iconKey.trim() || null,
      image: form.image.trim() || null,
      mediaId: form.mediaId.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isPublished: form.isPublished === 'true',
    };

    try {
      if (editingItem) {
        await updateAdminService(editingItem.id, payload);
        setSuccessMessage('Xidmət yeniləndi.');
      } else {
        await createAdminService(payload);
        setSuccessMessage('Yeni xidmət yaradıldı.');
      }

      setDialogOpen(false);
      await loadServices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Əməliyyat zamanı xəta baş verdi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Xidmətlər (Şöbələr)</h2>
          <p className="text-slate-500">Xidmətlərin idarə edilməsi və sıralanması.</p>
        </div>
        <Button
          className="bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm flex items-center gap-2"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="w-4 h-4" />
          Yeni Xidmət
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
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Xidmət Siyahısı</CardTitle>
              <CardDescription>Cəmi: {filteredItems.length} xidmət</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Xidmət axtar..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={String(index)} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Ad (AZ)</TableHead>
                    <TableHead>Ad (EN)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sıra</TableHead>
                    <TableHead className="text-right">Əməliyyat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-slate-900">{item.titleAz}</TableCell>
                      <TableCell className="text-slate-600">{item.titleEn}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.isPublished
                              ? 'bg-brand-blue-soft text-brand-blue border border-brand-blue/20'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell>{item.sortOrder}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menyu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => openEditDialog(item)}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              <span>Redaktə Et</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                              onClick={() => void handleDelete(item)}
                            >
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
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Xidməti redaktə et' : 'Yeni xidmət yarat'}</DialogTitle>
            <DialogDescription>
              AZ/EN/RU məzmununu doldurun. Boş EN/RU sahələri AZ məzmunundan doldurulacaq.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Başlıq (AZ)"
                  value={form.titleAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, titleAz: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Title (EN)"
                  value={form.titleEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, titleEn: event.target.value }))}
                />
                <Input
                  placeholder="Заголовок (RU)"
                  value={form.titleRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, titleRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-24"
                  placeholder="Qısa məzmun (AZ)"
                  value={form.summaryAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, summaryAz: event.target.value }))}
                  required
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Summary (EN)"
                  value={form.summaryEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, summaryEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Кратко (RU)"
                  value={form.summaryRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, summaryRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-32"
                  placeholder="Ətraflı məzmun (AZ)"
                  value={form.contentAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, contentAz: event.target.value }))}
                  required
                />
                <Textarea
                  className="min-h-32"
                  placeholder="Detailed content (EN)"
                  value={form.contentEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, contentEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-32"
                  placeholder="Подробное описание (RU)"
                  value={form.contentRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, contentRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-24"
                  placeholder="Highlights AZ (hər sətir bir item)"
                  value={form.highlightsAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, highlightsAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Highlights EN"
                  value={form.highlightsEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, highlightsEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Highlights RU"
                  value={form.highlightsRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, highlightsRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Icon key"
                  value={form.iconKey}
                  onChange={(event) => setForm((prev) => ({ ...prev, iconKey: event.target.value }))}
                />
                <Input
                  placeholder="Sort order"
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
                />
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.isPublished}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isPublished: event.target.value === 'false' ? 'false' : 'true',
                    }))
                  }
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
                <div className="flex items-center">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Yüklənir...' : 'Şəkil yüklə'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void handleImageUpload(event)}
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Şəkil URL"
                  value={form.image}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      image: event.target.value,
                      mediaId: '',
                    }))
                  }
                />
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.mediaId}
                  onChange={(event) => handleMediaSelect(event.target.value)}
                >
                  <option value="">Media secin (opsional)</option>
                  {mediaLibrary.map((media) => (
                    <option key={media.id} value={media.id}>
                      {media.originalName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedMedia ? (
                <p className="text-xs text-slate-500">
                  Secili media: {selectedMedia.originalName} ({selectedMedia.mimeType})
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Ləğv et
              </Button>
              <Button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-dark text-white"
                disabled={submitting || uploading}
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
