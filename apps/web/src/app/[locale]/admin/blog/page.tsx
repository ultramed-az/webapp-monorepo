'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { shouldBypassImageOptimization } from '@/lib/image';
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
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, Loader2, Upload } from 'lucide-react';
import {
  AdminMediaRecord,
  AdminBlogRecord,
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminMedia,
  getAdminBlogPosts,
  updateAdminBlogPost,
  uploadAdminMedia,
} from '@/lib/admin-api';

type FormState = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  excerptAz: string;
  excerptEn: string;
  excerptRu: string;
  contentAz: string;
  contentEn: string;
  contentRu: string;
  authorName: string;
  categoryAz: string;
  categoryEn: string;
  categoryRu: string;
  image: string;
  mediaId: string;
  sortOrder: string;
  views: string;
  published: 'true' | 'false';
  featured: 'true' | 'false';
};

const EMPTY_FORM: FormState = {
  titleAz: '',
  titleEn: '',
  titleRu: '',
  excerptAz: '',
  excerptEn: '',
  excerptRu: '',
  contentAz: '',
  contentEn: '',
  contentRu: '',
  authorName: '',
  categoryAz: '',
  categoryEn: '',
  categoryRu: '',
  image: '',
  mediaId: '',
  sortOrder: '0',
  views: '0',
  published: 'true',
  featured: 'false',
};

function toFormState(record: AdminBlogRecord): FormState {
  return {
    titleAz: record.titleAz,
    titleEn: record.titleEn,
    titleRu: record.titleRu,
    excerptAz: record.excerptAz ?? '',
    excerptEn: record.excerptEn ?? '',
    excerptRu: record.excerptRu ?? '',
    contentAz: record.contentAz,
    contentEn: record.contentEn,
    contentRu: record.contentRu,
    authorName: record.authorName ?? '',
    categoryAz: record.categoryAz ?? '',
    categoryEn: record.categoryEn ?? '',
    categoryRu: record.categoryRu ?? '',
    image: record.image ?? '',
    mediaId: record.mediaId ?? record.media?.id ?? '',
    sortOrder: String(record.sortOrder ?? 0),
    views: String(record.views ?? 0),
    published: record.published ? 'true' : 'false',
    featured: record.featured ? 'true' : 'false',
  };
}

function formatDate(value: string | null): string {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleDateString('az-AZ');
}

export default function BlogPage() {
  const [items, setItems] = useState<AdminBlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminBlogRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [mediaLibrary, setMediaLibrary] = useState<AdminMediaRecord[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) {
      return items;
    }

    return items.filter((item) =>
      [item.titleAz, item.authorName ?? '', item.categoryAz ?? '']
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
      const data = await getAdminBlogPosts();
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Bloq məqalələri yüklənmədi.');
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

  const openEditDialog = (item: AdminBlogRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminBlogRecord) => {
    const accepted = window.confirm(`"${item.titleAz}" məqaləsi silinsin?`);
    if (!accepted) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminBlogPost(item.id);
      setSuccessMessage('Məqalə silindi.');
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Məqalə silinmədi.');
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
      image: media.cdnUrl,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const titleAz = form.titleAz.trim();
    const contentAz = form.contentAz.trim();

    if (!titleAz || !contentAz) {
      setSubmitting(false);
      setErrorMessage('AZ title və AZ content mütləqdir.');
      return;
    }

    const payload: Partial<AdminBlogRecord> = {
      titleAz,
      titleEn: form.titleEn.trim() || titleAz,
      titleRu: form.titleRu.trim() || titleAz,
      excerptAz: form.excerptAz.trim() || null,
      excerptEn: form.excerptEn.trim() || null,
      excerptRu: form.excerptRu.trim() || null,
      contentAz: contentAz,
      contentEn: form.contentEn.trim() || contentAz,
      contentRu: form.contentRu.trim() || contentAz,
      authorName: form.authorName.trim() || 'Ultramed',
      categoryAz: form.categoryAz.trim() || null,
      categoryEn: form.categoryEn.trim() || null,
      categoryRu: form.categoryRu.trim() || null,
      image: form.image.trim() || null,
      mediaId: form.mediaId.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      views: Number.parseInt(form.views, 10) || 0,
      published: form.published === 'true',
      featured: form.featured === 'true',
      publishedAt: form.published === 'true' ? new Date().toISOString() : null,
    };

    try {
      if (editingItem) {
        await updateAdminBlogPost(editingItem.id, payload);
        setSuccessMessage('Məqalə yeniləndi.');
      } else {
        await createAdminBlogPost(payload);
        setSuccessMessage('Məqalə yaradıldı.');
      }

      setDialogOpen(false);
      await loadItems();
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bloq İdarəetməsi</h2>
          <p className="text-slate-500">Məqalələr backend CRUD ilə idarə olunur.</p>
        </div>
        <Button
          className="bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm flex items-center gap-2"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="w-4 h-4" />
          Yeni Məqalə
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
              <CardTitle className="text-lg">Məqalələrin Siyahısı</CardTitle>
              <CardDescription>Cəmi: {filteredItems.length} məqalə</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Başlıq və müəllif axtar..."
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
                    <TableHead>Şəkil</TableHead>
                    <TableHead>Başlıq</TableHead>
                    <TableHead>Müəllif</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Baxış</TableHead>
                    <TableHead>Tarix</TableHead>
                    <TableHead className="text-right">Əməliyyat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.image ? (
                          <div className="h-10 w-14 relative rounded overflow-hidden border border-slate-200">
                            <Image
                              src={item.image}
                              alt={item.titleAz}
                              fill
                              unoptimized={shouldBypassImageOptimization(item.image)}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">Yoxdur</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 max-w-80 truncate">{item.titleAz}</TableCell>
                      <TableCell>{item.authorName ?? '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.published
                              ? 'bg-brand-blue-soft text-brand-blue border border-brand-blue/20'
                              : 'bg-brand-orange/15 text-brand-orange-dark border border-brand-orange/25'
                          }`}
                        >
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell>{item.views}</TableCell>
                      <TableCell>{formatDate(item.publishedAt ?? item.createdAt)}</TableCell>
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
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Məqaləni redaktə et' : 'Yeni məqalə yarat'}</DialogTitle>
            <DialogDescription>
              Böyük mətnlər daxil olmaqla bütün əsas sahələr buradan idarə olunur.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Başlıq AZ"
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
                  className="min-h-20"
                  placeholder="Excerpt AZ"
                  value={form.excerptAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, excerptAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Excerpt EN"
                  value={form.excerptEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, excerptEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Excerpt RU"
                  value={form.excerptRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, excerptRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-40"
                  placeholder="Content AZ"
                  value={form.contentAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, contentAz: event.target.value }))}
                  required
                />
                <Textarea
                  className="min-h-40"
                  placeholder="Content EN"
                  value={form.contentEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, contentEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-40"
                  placeholder="Content RU"
                  value={form.contentRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, contentRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Müəllif"
                  value={form.authorName}
                  onChange={(event) => setForm((prev) => ({ ...prev, authorName: event.target.value }))}
                />
                <Input
                  placeholder="Kateqoriya AZ"
                  value={form.categoryAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, categoryAz: event.target.value }))}
                />
                <Input
                  placeholder="Category EN"
                  value={form.categoryEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, categoryEn: event.target.value }))}
                />
                <Input
                  placeholder="Category RU"
                  value={form.categoryRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, categoryRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-5">
                <Input
                  placeholder="Sort order"
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
                />
                <Input
                  placeholder="Views"
                  type="number"
                  value={form.views}
                  onChange={(event) => setForm((prev) => ({ ...prev, views: event.target.value }))}
                />
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.published}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      published: event.target.value === 'false' ? 'false' : 'true',
                    }))
                  }
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.featured}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      featured: event.target.value === 'true' ? 'true' : 'false',
                    }))
                  }
                >
                  <option value="false">Not featured</option>
                  <option value="true">Featured</option>
                </select>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
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
