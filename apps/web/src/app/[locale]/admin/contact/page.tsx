'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Clock, FileEdit, Loader2, Mail, MapPin, Phone, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  type AdminContactInfoRecord,
  type AdminContactLocalizedItem,
  createAdminContactInfo,
  deleteAdminContactInfo,
  getAdminContactInfos,
  updateAdminContactInfo,
} from '@/lib/admin-api';

type ContactItemsKey = 'phones' | 'emails' | 'workingHours';

type FormState = {
  slug: string;
  addressAz: string;
  addressEn: string;
  addressRu: string;
  mapLatitude: string;
  mapLongitude: string;
  mapEmbedUrl: string;
  phones: AdminContactLocalizedItem[];
  emails: AdminContactLocalizedItem[];
  workingHours: AdminContactLocalizedItem[];
};

const EMPTY_ITEM: AdminContactLocalizedItem = {
  labelAz: '',
  labelEn: '',
  labelRu: '',
  value: '',
};

const EMPTY_FORM: FormState = {
  slug: 'main',
  addressAz: '',
  addressEn: '',
  addressRu: '',
  mapLatitude: '',
  mapLongitude: '',
  mapEmbedUrl: '',
  phones: [
    { labelAz: 'Əlaqə nömrəsi', labelEn: 'Phone number', labelRu: 'Контактный номер', value: '' },
    { labelAz: 'WhatsApp', labelEn: 'WhatsApp', labelRu: 'WhatsApp', value: '' },
  ],
  emails: [
    { labelAz: 'E-poçt', labelEn: 'Email', labelRu: 'Эл. почта', value: '' },
  ],
  workingHours: [
    { labelAz: 'B.E - C', labelEn: 'Mon - Fri', labelRu: 'Пн - Пт', value: '' },
    { labelAz: 'Şənbə', labelEn: 'Saturday', labelRu: 'Суббота', value: '' },
  ],
};

function toFormState(record: AdminContactInfoRecord): FormState {
  return {
    slug: record.slug,
    addressAz: record.addressAz,
    addressEn: record.addressEn,
    addressRu: record.addressRu,
    mapLatitude: String(record.mapLatitude),
    mapLongitude: String(record.mapLongitude),
    mapEmbedUrl: record.mapEmbedUrl,
    phones: record.phones.length > 0 ? record.phones : [{ ...EMPTY_ITEM }],
    emails: record.emails.length > 0 ? record.emails : [{ ...EMPTY_ITEM }],
    workingHours: record.workingHours.length > 0 ? record.workingHours : [{ ...EMPTY_ITEM }],
  };
}

function cleanItems(items: AdminContactLocalizedItem[]): AdminContactLocalizedItem[] {
  return items
    .map((item) => ({
      labelAz: item.labelAz.trim(),
      labelEn: item.labelEn.trim(),
      labelRu: item.labelRu.trim(),
      value: item.value.trim(),
    }))
    .filter((item) => item.value.length > 0);
}

export default function AdminContactPage() {
  const [items, setItems] = useState<AdminContactInfoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AdminContactInfoRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedSlug = editingItem?.slug ?? null;

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.slug.localeCompare(b.slug)),
    [items],
  );

  const loadItems = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminContactInfos();
      setItems(data);

      if (data.length > 0) {
        const mainContact = data.find((item) => item.slug === 'main') ?? data[0];
        setEditingItem(mainContact);
        setForm(toFormState(mainContact));
      } else {
        setEditingItem(null);
        setForm(EMPTY_FORM);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Əlaqə məlumatları yüklənmədi.');
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

  const startCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const startEdit = (item: AdminContactInfoRecord) => {
    setEditingItem(item);
    setForm(toFormState(item));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const setItemField = (
    section: ContactItemsKey,
    index: number,
    field: keyof AdminContactLocalizedItem,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = (section: ContactItemsKey) => {
    setForm((current) => ({
      ...current,
      [section]: [...current[section], { ...EMPTY_ITEM }],
    }));
  };

  const removeItem = (section: ContactItemsKey, index: number) => {
    setForm((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleDelete = async (item: AdminContactInfoRecord) => {
    if (!window.confirm(`"${item.slug}" əlaqə məlumatı silinsin?`)) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminContactInfo(item.slug);
      setSuccessMessage('Əlaqə məlumatı silindi.');
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Əlaqə məlumatı silinmədi.');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const slug = form.slug.trim() || 'main';
    const addressAz = form.addressAz.trim();
    const mapLatitude = Number.parseFloat(form.mapLatitude);
    const mapLongitude = Number.parseFloat(form.mapLongitude);
    const mapEmbedUrl = form.mapEmbedUrl.trim();

    if (!addressAz || !Number.isFinite(mapLatitude) || !Number.isFinite(mapLongitude) || !mapEmbedUrl) {
      setSubmitting(false);
      setErrorMessage('AZ ünvan, koordinatlar və xəritə embed URL mütləqdir.');
      return;
    }

    const payload = {
      addressAz,
      addressEn: form.addressEn.trim() || addressAz,
      addressRu: form.addressRu.trim() || addressAz,
      mapLatitude,
      mapLongitude,
      mapEmbedUrl,
      phones: cleanItems(form.phones),
      emails: cleanItems(form.emails),
      workingHours: cleanItems(form.workingHours),
    };

    try {
      if (editingItem) {
        await updateAdminContactInfo(editingItem.slug, payload);
        setSuccessMessage('Əlaqə məlumatları yeniləndi.');
      } else {
        await createAdminContactInfo({ slug, ...payload });
        setSuccessMessage('Əlaqə məlumatları yaradıldı.');
      }
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Əməliyyat uğursuz oldu.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItemsEditor = (
    section: ContactItemsKey,
    title: string,
    Icon: typeof Phone,
    addLabel: string,
  ) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-5 w-5 text-brand-blue" />
            {title}
          </CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={() => addItem(section)}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {form[section].map((item, index) => (
          <div key={`${section}-${index}`} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">Sətir {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => removeItem(section, index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <Input
                placeholder="Label AZ"
                value={item.labelAz}
                onChange={(event) => setItemField(section, index, 'labelAz', event.target.value)}
              />
              <Input
                placeholder="Label EN"
                value={item.labelEn}
                onChange={(event) => setItemField(section, index, 'labelEn', event.target.value)}
              />
              <Input
                placeholder="Label RU"
                value={item.labelRu}
                onChange={(event) => setItemField(section, index, 'labelRu', event.target.value)}
              />
              <Input
                placeholder={section === 'emails' ? 'name@example.com' : 'Dəyər'}
                value={item.value}
                onChange={(event) => setItemField(section, index, 'value', event.target.value)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Əlaqə</h2>
          <p className="text-slate-500">
            /contact səhifəsində görünən ünvan, telefon, WhatsApp, e-poçt və iş saatlarını idarə edin.
          </p>
        </div>
        <Button className="bg-brand-orange text-white hover:bg-brand-orange-dark" onClick={startCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni əlaqə
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

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-blue" />
              Əlaqə qeydləri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : sortedItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                Hələ əlaqə məlumatı yoxdur. Yeni qeyd yaradın.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 transition ${selectedSlug === item.slug ? 'border-brand-blue bg-brand-blue-soft/50' : 'border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">{item.slug}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.addressAz}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => void handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{editingItem ? `"${editingItem.slug}" redaktə edilir` : 'Yeni əlaqə məlumatı'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="slug">Slug</label>
                  <Input
                    id="slug"
                    value={form.slug}
                    disabled={Boolean(editingItem)}
                    onChange={(event) => setField('slug', event.target.value)}
                    placeholder="main"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="latitude">Latitude</label>
                  <Input
                    id="latitude"
                    value={form.mapLatitude}
                    onChange={(event) => setField('mapLatitude', event.target.value)}
                    placeholder="40.376330"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="longitude">Longitude</label>
                  <Input
                    id="longitude"
                    value={form.mapLongitude}
                    onChange={(event) => setField('mapLongitude', event.target.value)}
                    placeholder="49.962867"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="addressAz">Ünvan AZ</label>
                  <Textarea
                    id="addressAz"
                    value={form.addressAz}
                    onChange={(event) => setField('addressAz', event.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="addressEn">Ünvan EN</label>
                  <Textarea
                    id="addressEn"
                    value={form.addressEn}
                    onChange={(event) => setField('addressEn', event.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="addressRu">Ünvan RU</label>
                  <Textarea
                    id="addressRu"
                    value={form.addressRu}
                    onChange={(event) => setField('addressRu', event.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="mapEmbedUrl">Google Maps embed URL</label>
                <Textarea
                  id="mapEmbedUrl"
                  value={form.mapEmbedUrl}
                  onChange={(event) => setField('mapEmbedUrl', event.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {renderItemsEditor('phones', 'Telefon və WhatsApp', Phone, 'Nömrə əlavə et')}
          {renderItemsEditor('workingHours', 'İş saatları', Clock, 'Saat əlavə et')}
          {renderItemsEditor('emails', 'E-poçt', Mail, 'E-poçt əlavə et')}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={startCreate}>
              Formu təmizlə
            </Button>
            <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange-dark" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Yadda saxla
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
