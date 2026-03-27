'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
import { FileEdit, Loader2, Plus, Search, Trash2, Upload } from 'lucide-react';
import {
  type AdminMediaRecord,
  type AdminGalleryRecord,
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  getAdminMedia,
  getAdminGalleryItems,
  updateAdminGalleryItem,
  uploadAdminMedia,
} from '@/lib/admin-api';
import { shouldBypassImageOptimization } from '@/lib/image';

type FormState = {
  imageUrl: string;
  mediaId: string;
  captionAz: string;
  captionEn: string;
  captionRu: string;
};

const EMPTY_FORM: FormState = {
  imageUrl: '',
  mediaId: '',
  captionAz: '',
  captionEn: '',
  captionRu: '',
};

function toFormState(item: AdminGalleryRecord): FormState {
  return {
    imageUrl: item.imageUrl,
    mediaId: item.mediaId ?? item.media?.id ?? '',
    captionAz: item.captionAz ?? '',
    captionEn: item.captionEn ?? '',
    captionRu: item.captionRu ?? '',
  };
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<AdminGalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminGalleryRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [mediaLibrary, setMediaLibrary] = useState<AdminMediaRecord[]>([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) {
      return items;
    }

    return items.filter((item) =>
      [item.captionAz ?? '', item.captionEn ?? '', item.captionRu ?? '', item.imageUrl]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, searchTerm]);

  const selectedMedia = useMemo(
    () => mediaLibrary.find((media) => media.id === form.mediaId) ?? null,
    [form.mediaId, mediaLibrary],
  );

  const loadItems = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminGalleryItems();
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Qalereya məlumatları yüklənmədi.');
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
    void loadItems();
    void loadMedia();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (item: AdminGalleryRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminGalleryRecord) => {
    const accepted = window.confirm('Bu şəkil silinsin?');
    if (!accepted) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminGalleryItem(item.id);
      setSuccessMessage('Qalereya elementi silindi.');
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Qalereya elementi silinmədi.');
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    try {
      const media = await uploadAdminMedia(file);
      setForm((prev) => ({
        ...prev,
        imageUrl: media.url,
        mediaId: media.id,
      }));
      setSuccessMessage('Şəkil yükləndi.');
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
      imageUrl: media.cdnUrl,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const imageUrl = form.imageUrl.trim();
    const mediaId = form.mediaId.trim();
    if (!imageUrl && !mediaId) {
      setSubmitting(false);
      setErrorMessage('Şəkil URL və ya media seçimi mütləqdir.');
      return;
    }

    const captionAz = form.captionAz.trim();
    const payload: Partial<AdminGalleryRecord> = {
      ...(imageUrl ? { imageUrl } : {}),
      mediaId: mediaId || null,
      captionAz: captionAz || null,
      captionEn: form.captionEn.trim() || captionAz || null,
      captionRu: form.captionRu.trim() || captionAz || null,
    };

    try {
      if (editingItem) {
        await updateAdminGalleryItem(editingItem.id, payload);
        setSuccessMessage('Qalereya elementi yeniləndi.');
      } else {
        await createAdminGalleryItem(payload);
        setSuccessMessage('Qalereya elementi yaradıldı.');
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Qalereya İdarəetməsi</h2>
          <p className="text-slate-500">Qalereya şəkillərinin və media fayllarının idarə edilməsi.</p>
        </div>
        <Button
          className="bg-brand-orange hover:bg-brand-orange-dark text-white"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Şəkil
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
            <CardTitle>Qalereya Siyahısı</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Qalereyada axtar..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={String(index)} className="h-60 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-lg border border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              Nəticə tapılmadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-slate-200">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.captionAz ?? 'Gallery image'}
                      fill
                      unoptimized={shouldBypassImageOptimization(item.imageUrl)}
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="font-semibold text-slate-900">{item.captionAz ?? 'Başlıq yoxdur'}</p>
                    <div className="flex items-center gap-2">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Şəkli redaktə et' : 'Yeni şəkil əlavə et'}</DialogTitle>
            <DialogDescription>
              Şəkli yükləyin və AZ/EN/RU başlıqları əlavə edin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  placeholder="Şəkil URL"
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      imageUrl: event.target.value,
                      mediaId: '',
                    }))
                  }
                  required
                />
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Yüklənir...' : 'Şəkil yüklə'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

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
              {selectedMedia ? (
                <p className="text-xs text-slate-500">
                  Secili media: {selectedMedia.originalName} ({selectedMedia.mimeType})
                </p>
              ) : null}

              {form.imageUrl ? (
                <div className="relative h-52 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image
                    src={form.imageUrl}
                    alt="Preview"
                    fill
                    unoptimized={shouldBypassImageOptimization(form.imageUrl)}
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Başlıq AZ"
                  value={form.captionAz}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, captionAz: event.target.value }))
                  }
                />
                <Input
                  placeholder="Caption EN"
                  value={form.captionEn}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, captionEn: event.target.value }))
                  }
                />
                <Input
                  placeholder="Заголовок RU"
                  value={form.captionRu}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, captionRu: event.target.value }))
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
