"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { Product, Category } from "@/lib/db/schema";

type FieldErrors = Record<string, string[]>;

function fieldError(
  state: ActionResult<FieldErrors> | null,
  field: string
): string | undefined {
  if (!state || state.success) return undefined;
  if (typeof state.error === "string") return undefined;
  return state.error[field]?.[0];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProductFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
  product?: Product;
  categories?: Category[];
  submitLabel?: string;
}

export function ProductForm({
  action,
  product,
  categories = [],
  submitLabel = "Uložit produkt",
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<FieldErrors> | null,
    FormData
  >(
    action as (
      prev: ActionResult<FieldErrors> | null,
      fd: FormData
    ) => Promise<ActionResult<FieldErrors>>,
    null
  );

  const descriptionRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!product?.slug);

  const editor = useEditor({
    extensions: [StarterKit],
    content: product?.description ?? "",
    onUpdate({ editor }) {
      if (descriptionRef.current) {
        descriptionRef.current.value = editor.getHTML();
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && descriptionRef.current) {
      descriptionRef.current.value = editor.getHTML();
    }
  }, [editor]);

  const formError =
    state && !state.success && typeof state.error === "string"
      ? state.error
      : null;

  return (
    <form action={formAction} className="space-y-5">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      {/* Název + Slug */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Název <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product?.name}
            onChange={(e) => {
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "name") && (
            <p className="text-xs text-destructive">{fieldError(state, "name")}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug (URL) <span className="text-destructive">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="napr-bavlnena-latka"
          />
          {fieldError(state, "slug") && (
            <p className="text-xs text-destructive">{fieldError(state, "slug")}</p>
          )}
        </div>
      </div>

      {/* Popis — TipTap */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Popis</label>
        <div className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
          <EditorContent editor={editor} />
        </div>
        <input
          ref={descriptionRef}
          type="hidden"
          name="description"
          defaultValue={product?.description ?? ""}
        />
      </div>

      {/* Cena + Srovnávací cena */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="price" className="text-sm font-medium">
            Cena (Kč) <span className="text-destructive">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={product ? String(product.price) : ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "price") && (
            <p className="text-xs text-destructive">{fieldError(state, "price")}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="compareAtPrice" className="text-sm font-medium">
            Původní cena (Kč)
          </label>
          <input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={
              product?.compareAtPrice ? String(product.compareAtPrice) : ""
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "compareAtPrice") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "compareAtPrice")}
            </p>
          )}
        </div>
      </div>

      {/* SKU + Sklad */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="sku" className="text-sm font-medium">SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={product?.sku ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="např. LAT-001"
          />
          {fieldError(state, "sku") && (
            <p className="text-xs text-destructive">{fieldError(state, "sku")}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="stock" className="text-sm font-medium">
            Počet na skladě
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            defaultValue={product?.stock ?? 0}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "stock") && (
            <p className="text-xs text-destructive">{fieldError(state, "stock")}</p>
          )}
        </div>
      </div>

      {/* Váha + Rozměry */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="weight" className="text-sm font-medium">
            Váha (kg)
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={product?.weight ? String(product.weight) : ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "weight") && (
            <p className="text-xs text-destructive">{fieldError(state, "weight")}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="dimensions" className="text-sm font-medium">
            Rozměry
          </label>
          <input
            id="dimensions"
            name="dimensions"
            type="text"
            defaultValue={product?.dimensions ?? ""}
            placeholder="např. 150cm x 300cm"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "dimensions") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "dimensions")}
            </p>
          )}
        </div>
      </div>

      {/* Kategorie + Stav */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-sm font-medium">
            Kategorie
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">— Bez kategorie —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {fieldError(state, "categoryId") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "categoryId")}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="text-sm font-medium">
            Stav
          </label>
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? "inactive"}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="inactive">Neaktivní</option>
            <option value="active">Aktivní</option>
          </select>
          {fieldError(state, "status") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "status")}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám…" : submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={() => history.back()}>
          Zrušit
        </Button>
      </div>
    </form>
  );
}
