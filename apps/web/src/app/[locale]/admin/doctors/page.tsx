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
  AdminDoctorRecord,
  createAdminDoctor,
  deleteAdminDoctor,
  getAdminDoctors,
  updateAdminDoctor,
  uploadAdminMedia,
} from '@/lib/admin-api';

type FormState = {
  name: string;
  specialty: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  bioAz: string;
  bioEn: string;
  bioRu: string;
  profileAz: string;
  profileEn: string;
  profileRu: string;
  experience: string;
  educationAz: string;
  educationEn: string;
  educationRu: string;
  roomAz: string;
  roomEn: string;
  roomRu: string;
  scheduleAz: string;
  scheduleEn: string;
  scheduleRu: string;
  languagesAz: string;
  languagesEn: string;
  languagesRu: string;
  proceduresAz: string;
  proceduresEn: string;
  proceduresRu: string;
  tagsAz: string;
  tagsEn: string;
  tagsRu: string;
  phone: string;
  email: string;
  image: string;
  sortOrder: string;
  isPublished: 'true' | 'false';
};

const EMPTY_FORM: FormState = {
  name: '',
  specialty: '',
  titleAz: '',
  titleEn: '',
  titleRu: '',
  bioAz: '',
  bioEn: '',
  bioRu: '',
  profileAz: '',
  profileEn: '',
  profileRu: '',
  experience: '',
  educationAz: '',
  educationEn: '',
  educationRu: '',
  roomAz: '',
  roomEn: '',
  roomRu: '',
  scheduleAz: '',
  scheduleEn: '',
  scheduleRu: '',
  languagesAz: '',
  languagesEn: '',
  languagesRu: '',
  proceduresAz: '',
  proceduresEn: '',
  proceduresRu: '',
  tagsAz: '',
  tagsEn: '',
  tagsRu: '',
  phone: '',
  email: '',
  image: '',
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

function toFormState(record: AdminDoctorRecord): FormState {
  return {
    name: record.name,
    specialty: record.specialty,
    titleAz: record.titleAz,
    titleEn: record.titleEn,
    titleRu: record.titleRu,
    bioAz: record.bioAz,
    bioEn: record.bioEn,
    bioRu: record.bioRu,
    profileAz: record.profileAz ?? '',
    profileEn: record.profileEn ?? '',
    profileRu: record.profileRu ?? '',
    experience: record.experience ?? '',
    educationAz: record.educationAz ?? '',
    educationEn: record.educationEn ?? '',
    educationRu: record.educationRu ?? '',
    roomAz: record.roomAz ?? '',
    roomEn: record.roomEn ?? '',
    roomRu: record.roomRu ?? '',
    scheduleAz: toLines(record.scheduleAz),
    scheduleEn: toLines(record.scheduleEn),
    scheduleRu: toLines(record.scheduleRu),
    languagesAz: toLines(record.languagesAz),
    languagesEn: toLines(record.languagesEn),
    languagesRu: toLines(record.languagesRu),
    proceduresAz: toLines(record.proceduresAz),
    proceduresEn: toLines(record.proceduresEn),
    proceduresRu: toLines(record.proceduresRu),
    tagsAz: toLines(record.tagsAz),
    tagsEn: toLines(record.tagsEn),
    tagsRu: toLines(record.tagsRu),
    phone: record.phone ?? '',
    email: record.email ?? '',
    image: record.image ?? '',
    sortOrder: String(record.sortOrder ?? 0),
    isPublished: record.isPublished ? 'true' : 'false',
  };
}

export default function DoctorsPage() {
  const [items, setItems] = useState<AdminDoctorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminDoctorRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

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
      [item.name, item.specialty, item.titleAz, item.titleEn, item.titleRu]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, searchTerm]);

  const loadDoctors = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getAdminDoctors();
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Həkimlər yüklənmədi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDoctors();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (item: AdminDoctorRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setDialogOpen(true);
  };

  const handleDelete = async (item: AdminDoctorRecord) => {
    const accepted = window.confirm(`"${item.name}" həkimini silmək istəyirsiniz?`);
    if (!accepted) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminDoctor(item.id);
      setSuccessMessage('Həkim silindi.');
      await loadDoctors();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Həkim silinmədi.');
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
      setForm((prev) => ({ ...prev, image: media.url }));
      setSuccessMessage('Şəkil yükləndi.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Şəkil yüklənmədi.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const name = form.name.trim();
    const specialty = form.specialty.trim();
    const titleAz = form.titleAz.trim();
    const bioAz = form.bioAz.trim();

    if (!name || !specialty || !titleAz || !bioAz) {
      setSubmitting(false);
      setErrorMessage('Ad, ixtisas, AZ title və AZ bio boş ola bilməz.');
      return;
    }

    const payload: Partial<AdminDoctorRecord> = {
      name,
      specialty,
      titleAz,
      titleEn: form.titleEn.trim() || titleAz,
      titleRu: form.titleRu.trim() || titleAz,
      bioAz,
      bioEn: form.bioEn.trim() || bioAz,
      bioRu: form.bioRu.trim() || bioAz,
      profileAz: form.profileAz.trim() || null,
      profileEn: form.profileEn.trim() || null,
      profileRu: form.profileRu.trim() || null,
      experience: form.experience.trim() || null,
      educationAz: form.educationAz.trim() || null,
      educationEn: form.educationEn.trim() || null,
      educationRu: form.educationRu.trim() || null,
      roomAz: form.roomAz.trim() || null,
      roomEn: form.roomEn.trim() || null,
      roomRu: form.roomRu.trim() || null,
      scheduleAz: splitLines(form.scheduleAz),
      scheduleEn: splitLines(form.scheduleEn),
      scheduleRu: splitLines(form.scheduleRu),
      languagesAz: splitLines(form.languagesAz),
      languagesEn: splitLines(form.languagesEn),
      languagesRu: splitLines(form.languagesRu),
      proceduresAz: splitLines(form.proceduresAz),
      proceduresEn: splitLines(form.proceduresEn),
      proceduresRu: splitLines(form.proceduresRu),
      tagsAz: splitLines(form.tagsAz),
      tagsEn: splitLines(form.tagsEn),
      tagsRu: splitLines(form.tagsRu),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      image: form.image.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isPublished: form.isPublished === 'true',
    };

    try {
      if (editingItem) {
        await updateAdminDoctor(editingItem.id, payload);
        setSuccessMessage('Həkim yeniləndi.');
      } else {
        await createAdminDoctor(payload);
        setSuccessMessage('Yeni həkim yaradıldı.');
      }

      setDialogOpen(false);
      await loadDoctors();
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Həkimlər</h2>
          <p className="text-slate-500">Həkimlər backend CRUD ilə idarə olunur.</p>
        </div>
        <Button
          className="bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm flex items-center gap-2"
          onClick={openCreateDialog}
          type="button"
        >
          <Plus className="w-4 h-4" />
          Yeni Həkim
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
              <CardTitle className="text-lg">Həkim Siyahısı</CardTitle>
              <CardDescription>Cəmi: {filteredItems.length} həkim</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Həkim axtar..."
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
                    <TableHead>Ad</TableHead>
                    <TableHead>İxtisas</TableHead>
                    <TableHead>Əlaqə</TableHead>
                    <TableHead>Təcrübə</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Əməliyyat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
                      <TableCell>{item.specialty}</TableCell>
                      <TableCell className="text-sm text-slate-600">{item.email ?? '-'}</TableCell>
                      <TableCell>{item.experience ?? '-'}</TableCell>
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
            <DialogTitle>{editingItem ? 'Həkimi redaktə et' : 'Yeni həkim yarat'}</DialogTitle>
            <DialogDescription>
              Əsas sahələri doldurun. Çoxdilli sahələr boş olarsa AZ dəyərlərindən istifadə ediləcək.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Ad Soyad"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
                <Input
                  placeholder="İxtisas (specialty)"
                  value={form.specialty}
                  onChange={(event) => setForm((prev) => ({ ...prev, specialty: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Təcrübə (məs: 10 il)"
                  value={form.experience}
                  onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))}
                />
              </div>

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
                  placeholder="Bio AZ"
                  value={form.bioAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, bioAz: event.target.value }))}
                  required
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Bio EN"
                  value={form.bioEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, bioEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-24"
                  placeholder="Bio RU"
                  value={form.bioRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, bioRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-20"
                  placeholder="Profile AZ"
                  value={form.profileAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, profileAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Profile EN"
                  value={form.profileEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, profileEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Profile RU"
                  value={form.profileRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, profileRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Education AZ"
                  value={form.educationAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, educationAz: event.target.value }))}
                />
                <Input
                  placeholder="Education EN"
                  value={form.educationEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, educationEn: event.target.value }))}
                />
                <Input
                  placeholder="Education RU"
                  value={form.educationRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, educationRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Room AZ"
                  value={form.roomAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, roomAz: event.target.value }))}
                />
                <Input
                  placeholder="Room EN"
                  value={form.roomEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, roomEn: event.target.value }))}
                />
                <Input
                  placeholder="Room RU"
                  value={form.roomRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, roomRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-20"
                  placeholder="Schedule AZ (hər sətir bir item)"
                  value={form.scheduleAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, scheduleAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Schedule EN"
                  value={form.scheduleEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, scheduleEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Schedule RU"
                  value={form.scheduleRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, scheduleRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-20"
                  placeholder="Languages AZ"
                  value={form.languagesAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, languagesAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Languages EN"
                  value={form.languagesEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, languagesEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Languages RU"
                  value={form.languagesRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, languagesRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-20"
                  placeholder="Procedures AZ"
                  value={form.proceduresAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, proceduresAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Procedures EN"
                  value={form.proceduresEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, proceduresEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Procedures RU"
                  value={form.proceduresRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, proceduresRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Textarea
                  className="min-h-20"
                  placeholder="Tags AZ"
                  value={form.tagsAz}
                  onChange={(event) => setForm((prev) => ({ ...prev, tagsAz: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Tags EN"
                  value={form.tagsEn}
                  onChange={(event) => setForm((prev) => ({ ...prev, tagsEn: event.target.value }))}
                />
                <Textarea
                  className="min-h-20"
                  placeholder="Tags RU"
                  value={form.tagsRu}
                  onChange={(event) => setForm((prev) => ({ ...prev, tagsRu: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
                <Input
                  placeholder="E-poçt"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
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
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  placeholder="Şəkil URL"
                  value={form.image}
                  onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                />
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
