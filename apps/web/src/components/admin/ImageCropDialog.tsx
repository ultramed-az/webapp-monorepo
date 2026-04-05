'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Move, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Offset = {
  x: number;
  y: number;
};

type ContainerSize = {
  width: number;
  height: number;
};

type Props = {
  open: boolean;
  file: File | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => Promise<void> | void;
  aspect?: number;
  title?: string;
  description?: string;
};

const DEFAULT_SIZE: ContainerSize = {
  width: 640,
  height: 480,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toOutputExtension(type: string, fallbackName: string) {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  const dotIndex = fallbackName.lastIndexOf('.');
  if (dotIndex >= 0 && dotIndex < fallbackName.length - 1) {
    return fallbackName.slice(dotIndex + 1);
  }
  return 'jpg';
}

export default function ImageCropDialog({
  open,
  file,
  onOpenChange,
  onConfirm,
  aspect = 4 / 3,
  title = 'Şəkli kəs',
  description = 'Şəkli sürüşdürərək və yaxınlaşdıraraq kadrı seçin. Upload zamanı yalnız seçdiyiniz hissə göndəriləcək.',
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<ContainerSize | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>(DEFAULT_SIZE);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const cropAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      setNaturalSize(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setImageUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setError(null);
  }, [file, open]);

  useEffect(() => {
    if (!imageUrl) {
      setNaturalSize(null);
      return;
    }

    const image = new window.Image();
    image.onload = () => {
      setNaturalSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const element = cropAreaRef.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const width = element.clientWidth || DEFAULT_SIZE.width;
      setContainerSize({
        width,
        height: width / aspect,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [aspect, open]);

  const baseScale = useMemo(() => {
    if (!naturalSize) {
      return 1;
    }

    return Math.max(
      containerSize.width / naturalSize.width,
      containerSize.height / naturalSize.height,
    );
  }, [containerSize.height, containerSize.width, naturalSize]);

  const displayWidth = useMemo(() => {
    if (!naturalSize) {
      return containerSize.width;
    }

    return naturalSize.width * baseScale * zoom;
  }, [baseScale, containerSize.width, naturalSize, zoom]);

  const displayHeight = useMemo(() => {
    if (!naturalSize) {
      return containerSize.height;
    }

    return naturalSize.height * baseScale * zoom;
  }, [baseScale, containerSize.height, naturalSize, zoom]);

  const clampOffset = (nextOffset: Offset, width = displayWidth, height = displayHeight) => {
    const maxX = Math.max(0, (width - containerSize.width) / 2);
    const maxY = Math.max(0, (height - containerSize.height) / 2);

    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  };

  useEffect(() => {
    setOffset((current) => clampOffset(current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayWidth, displayHeight, containerSize.width, containerSize.height]);

  const previewStyle = useMemo(
    () => ({
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
    }),
    [displayHeight, displayWidth, offset.x, offset.y],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!naturalSize) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart) {
      return;
    }

    const nextOffset = clampOffset({
      x: dragStart.offsetX + (event.clientX - dragStart.pointerX),
      y: dragStart.offsetY + (event.clientY - dragStart.pointerY),
    });

    setOffset(nextOffset);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore capture release failures.
      }
    }
    setDragStart(null);
  };

  const handleZoomChange = (nextZoom: number) => {
    setZoom(nextZoom);
    const nextWidth = naturalSize ? naturalSize.width * baseScale * nextZoom : containerSize.width;
    const nextHeight = naturalSize ? naturalSize.height * baseScale * nextZoom : containerSize.height;
    setOffset((current) => clampOffset(current, nextWidth, nextHeight));
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setError(null);
  };

  const handleConfirm = async () => {
    if (!file || !imageUrl) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const image = new window.Image();
      image.src = imageUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Şəkli oxumaq mümkün olmadı.'));
      });

      const outputWidth = 1600;
      const outputHeight = Math.round(outputWidth / aspect);
      const outputScale = outputWidth / containerSize.width;
      const imageLeft = (containerSize.width - displayWidth) / 2 + offset.x;
      const imageTop = (containerSize.height - displayHeight) / 2 + offset.y;

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Şəkil emalı üçün canvas yaratmaq mümkün olmadı.');
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(
        image,
        imageLeft * outputScale,
        imageTop * outputScale,
        displayWidth * outputScale,
        displayHeight * outputScale,
      );

      const mimeType = file.type === 'image/png' || file.type === 'image/webp'
        ? file.type
        : 'image/jpeg';

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) => {
            if (!value) {
              reject(new Error('Kəsilmiş şəkli yaratmaq mümkün olmadı.'));
              return;
            }

            resolve(value);
          },
          mimeType,
          mimeType === 'image/jpeg' ? 0.92 : undefined,
        );
      });

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const extension = toOutputExtension(mimeType, file.name);
      const croppedFile = new File(
        [blob],
        `${baseName}-cropped.${extension}`,
        { type: mimeType },
      );

      await onConfirm(croppedFile);
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Şəkil kəsilmədi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!saving}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            ref={cropAreaRef}
            className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner"
            style={{ aspectRatio: `${aspect}` }}
          >
            {imageUrl ? (
              <>
                <div
                  className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    draggable={false}
                    className="absolute max-w-none select-none"
                    style={previewStyle}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Şəkil seçilməyib.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Search className="h-4 w-4 text-brand-blue" />
                  Yaxınlaşdırma
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(event) => handleZoomChange(Number(event.target.value))}
                  className="w-full accent-brand-orange"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Move className="h-3.5 w-3.5" />
                  Şəkli sürüşdürərək baş hissəni və əsas kadrı tam görünən formada yerləşdirin.
                </div>
              </div>

              <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
                Sıfırla
              </Button>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Ləğv et
          </Button>
          <Button type="button" className="bg-brand-orange hover:bg-brand-orange-dark text-white" onClick={() => void handleConfirm()} disabled={!file || saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kəs və yüklə
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
