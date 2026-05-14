"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductImage, deleteProductImage, reorderProductImages } from "@/lib/actions/product-images";
import type { ProductImage } from "@/lib/db/schema";

const MAX_IMAGES = 10;

interface ProductImageUploadProps {
  productId: string;
  initialImages: ProductImage[];
}

export function ProductImageUpload({
  productId,
  initialImages,
}: ProductImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (images.length >= MAX_IMAGES) {
      setUploadError(`Maximálně ${MAX_IMAGES} obrázků`);
      return;
    }

    setUploadError(null);
    setUploading(true);

    const remaining = MAX_IMAGES - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    for (const file of toUpload) {
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/products/images/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();

        if (!res.ok) {
          setUploadError(data.error ?? "Chyba nahrávání");
          break;
        }

        const position = images.length;
        await addProductImage(productId, data.url, file.name, position);

        setImages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            productId,
            url: data.url,
            alt: file.name,
            position,
            createdAt: new Date(),
          },
        ]);
      } catch {
        setUploadError("Chyba sítě. Zkus to znovu.");
        break;
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProductImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    });
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    setImages(reordered);
    setDragIndex(index);
  }

  function handleDragEnd() {
    if (dragIndex === null) return;
    setDragIndex(null);

    startTransition(async () => {
      await reorderProductImages(
        productId,
        images.map((img) => img.id)
      );
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        Obrázky{" "}
        <span className="text-muted-foreground font-normal">
          ({images.length}/{MAX_IMAGES})
        </span>
      </p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-sm text-muted-foreground transition hover:bg-muted/50"
      >
        <Upload className="h-6 w-6" />
        <p>Klikni nebo přetáhni soubory sem</p>
        <p className="text-xs">JPEG, PNG, WebP · max 5 MB · max {MAX_IMAGES} fotek</p>
        {uploading && (
          <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full animate-pulse rounded-full bg-primary" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading || images.length >= MAX_IMAGES}
      />

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {/* Gallery grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted ${
                index === 0 ? "ring-2 ring-primary" : ""
              } ${dragIndex === index ? "opacity-50" : ""}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? "Obrázek produktu"}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Drag handle */}
              <div className="absolute left-1 top-1 cursor-grab opacity-0 group-hover:opacity-100 transition">
                <GripVertical className="h-4 w-4 text-white drop-shadow" />
              </div>
              {/* Position badge */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-primary px-1 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  Hlavní
                </span>
              )}
              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Smazat obrázek?")) handleDelete(img.id);
                }}
                disabled={isPending}
                className="absolute right-1 top-1 rounded bg-destructive p-0.5 opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3 text-destructive-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Přetáhni obrázky pro změnu pořadí · první obrázek = hlavní
        </p>
      )}
    </div>
  );
}
