'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AdminMediaCleanupResult,
  AdminMediaRecord,
  cleanupAdminOrphanMedia,
  deleteAdminMedia,
  getAdminMedia,
} from '@/lib/admin-api';
import { shouldBypassImageOptimization } from '@/lib/image';
import { Loader2, RefreshCcw, Search, ShieldAlert, Trash2, WandSparkles } from 'lucide-react';

type CleanupStatus = AdminMediaCleanupResult['items'][number]['status'];

function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function toPositiveInt(raw: string, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

function statusBadgeClass(status: CleanupStatus): string {
  if (status === 'deleted' || status === 'would_delete') {
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  }

  if (status === 'skipped_in_use') {
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  }

  return 'bg-red-100 text-red-700 border border-red-200';
}

function statusLabel(status: CleanupStatus): string {
  switch (status) {
    case 'would_delete':
      return 'Dry-run: silinecek';
    case 'deleted':
      return 'Silindi';
    case 'skipped_in_use':
      return 'Atlandı (in use)';
    case 'deleted_file_missing':
      return 'DB silindi, fayl tapılmadı';
    case 'deleted_file_error':
      return 'DB silindi, fayl silme xətası';
    default:
      return status;
  }
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<AdminMediaRecord[]>([]);
  const [cleanupResult, setCleanupResult] = useState<AdminMediaCleanupResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [runningDryRun, setRunningDryRun] = useState(false);
  const [runningCleanup, setRunningCleanup] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState('100');
  const [olderThanHours, setOlderThanHours] = useState('24');
  const [orphansOnly, setOrphansOnly] = useState<'true' | 'false'>('false');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const parsedLimit = useMemo(() => toPositiveInt(limit, 100, 1, 100), [limit]);
  const parsedOlderThanHours = useMemo(
    () => toPositiveInt(olderThanHours, 24, 1, 24 * 30),
    [olderThanHours],
  );

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) {
      return items;
    }

    return items.filter((item) =>
      [item.originalName, item.storageKey, item.mimeType, item.cdnUrl]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, searchTerm]);

  const loadMedia = async (options?: { silent?: boolean }) => {
    if (options?.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorMessage(null);
    try {
      const data = await getAdminMedia(parsedLimit, {
        orphansOnly: orphansOnly === 'true',
        olderThanHours: parsedOlderThanHours,
      });
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Media listesi yüklənmədi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  const handleApplyFilters = async () => {
    await loadMedia();
  };

  const handleDryRun = async () => {
    setRunningDryRun(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await cleanupAdminOrphanMedia({
        dryRun: true,
        limit: parsedLimit,
        olderThanHours: parsedOlderThanHours,
      });
      setCleanupResult(result);
      setSuccessMessage(`Dry-run tamamlandı. Namizəd sayı: ${result.scannedCount}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Dry-run uğursuz oldu.');
    } finally {
      setRunningDryRun(false);
    }
  };

  const handleCleanup = async () => {
    const accepted = window.confirm(
      `Bu əməliyyat orphan media fayllarını siləcək.\nLimit: ${parsedLimit}\nYaş həddi: ${parsedOlderThanHours} saat\nDavam edilsin?`,
    );
    if (!accepted) {
      return;
    }

    setRunningCleanup(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await cleanupAdminOrphanMedia({
        dryRun: false,
        limit: parsedLimit,
        olderThanHours: parsedOlderThanHours,
      });
      setCleanupResult(result);
      setSuccessMessage(
        `Cleanup tamamlandı. Silindi: ${result.deletedCount}, Atlandı: ${result.skippedInUseCount}`,
      );
      await loadMedia({ silent: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Cleanup uğursuz oldu.');
    } finally {
      setRunningCleanup(false);
    }
  };

  const handleDeleteSingle = async (item: AdminMediaRecord) => {
    const usageTotal = item.usage?.total ?? 0;
    const accepted = window.confirm(
      usageTotal > 0
        ? 'Bu media istifadə olunur və silinməməlidir. Yenə də davam etmək istəyirsiniz?'
        : `"${item.originalName}" silinsin?`,
    );
    if (!accepted) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteAdminMedia(item.id);
      setSuccessMessage('Media silindi.');
      await loadMedia({ silent: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Media silinmədi.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Media Cleanup</h2>
          <p className="text-slate-500">
            Orphan media faylları üçün dry-run və təhlükəsiz batch cleanup idarəsi.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-slate-200"
          onClick={() => void loadMedia({ silent: true })}
          disabled={refreshing || loading}
        >
          {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
          Yenilə
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
          <CardTitle>Filter və əməliyyat</CardTitle>
          <CardDescription>
            Əvvəlcə dry-run edin, sonra nəticəni yoxlayıb real cleanup başladın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Media adı və ya storage key ilə axtar..."
                className="pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Input
              type="number"
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              placeholder="Limit"
            />
            <Input
              type="number"
              value={olderThanHours}
              onChange={(event) => setOlderThanHours(event.target.value)}
              placeholder="Older than (saat)"
            />
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
              value={orphansOnly}
              onChange={(event) =>
                setOrphansOnly(event.target.value === 'true' ? 'true' : 'false')
              }
            >
              <option value="false">Bütün media</option>
              <option value="true">Yalnız orphan media</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-slate-200"
              onClick={() => void handleApplyFilters()}
              disabled={loading || refreshing}
            >
              Filteri tətbiq et
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              onClick={() => void handleDryRun()}
              disabled={runningDryRun || runningCleanup}
            >
              {runningDryRun ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <WandSparkles className="h-4 w-4 mr-2" />
              )}
              Dry-run
            </Button>
            <Button
              type="button"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white"
              onClick={() => void handleCleanup()}
              disabled={runningDryRun || runningCleanup}
            >
              {runningCleanup ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShieldAlert className="h-4 w-4 mr-2" />
              )}
              Cleanup başlat
            </Button>
          </div>
        </CardContent>
      </Card>

      {cleanupResult ? (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Son cleanup nəticəsi</CardTitle>
            <CardDescription>
              Rejim: {cleanupResult.dryRun ? 'Dry-run' : 'Real cleanup'} | Yaş həddi:{' '}
              {cleanupResult.olderThanHours} saat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-500">Scanned</p>
                <p className="font-semibold text-slate-900">{cleanupResult.scannedCount}</p>
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-500">Deleted</p>
                <p className="font-semibold text-slate-900">{cleanupResult.deletedCount}</p>
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-500">Skipped in-use</p>
                <p className="font-semibold text-slate-900">{cleanupResult.skippedInUseCount}</p>
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-500">File deleted</p>
                <p className="font-semibold text-slate-900">{cleanupResult.fileDeletedCount}</p>
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-500">File missing</p>
                <p className="font-semibold text-slate-900">{cleanupResult.fileMissingCount}</p>
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-500">File errors</p>
                <p className="font-semibold text-slate-900">{cleanupResult.fileDeleteErrorCount}</p>
              </div>
            </div>

            <div className="rounded-md border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Media ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Storage key</TableHead>
                    <TableHead>Səbəb</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cleanupResult.items.slice(0, 20).map((item) => (
                    <TableRow key={`${item.id}-${item.status}`}>
                      <TableCell className="font-mono text-xs text-slate-600">{item.id}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">{item.storageKey}</TableCell>
                      <TableCell className="text-xs text-slate-600">{item.reason ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Media siyahısı</CardTitle>
          <CardDescription>Filtrdən sonra görünən qeyd sayı: {filteredItems.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={String(index)} className="h-14 w-full" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-md border border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              Göstəriləcək media tapılmadı.
            </div>
          ) : (
            <div className="rounded-md border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Növ / Ölçü</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Orphan</TableHead>
                    <TableHead>Tarix</TableHead>
                    <TableHead className="text-right">Əməliyyat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const usageTotal = item.usage?.total ?? 0;
                    const isOrphan = item.isOrphan ?? usageTotal === 0;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="h-12 w-16 relative rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                            <Image
                              src={item.cdnUrl}
                              alt={item.originalName}
                              fill
                              className="object-cover"
                              unoptimized={shouldBypassImageOptimization(item.cdnUrl)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-900">{item.originalName}</p>
                          <p className="text-xs text-slate-500 font-mono">{item.storageKey}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-slate-700">{item.mimeType}</p>
                          <p className="text-xs text-slate-500">{formatBytes(item.size)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-slate-700">Toplam: {usageTotal}</p>
                          <p className="text-xs text-slate-500">
                            S:{item.usage?.services ?? 0} D:{item.usage?.doctors ?? 0} B:{item.usage?.blogPosts ?? 0} G:{item.usage?.galleryItems ?? 0}
                          </p>
                        </TableCell>
                        <TableCell>
                          {isOrphan ? (
                            <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                              Orphan
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                              In use
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {new Date(item.createdAt).toLocaleString('az-AZ')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            disabled={deletingId === item.id || usageTotal > 0}
                            onClick={() => void handleDeleteSingle(item)}
                            title={usageTotal > 0 ? 'Bu media istifadə olunur, silinməz.' : undefined}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
