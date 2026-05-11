"use client";

import { useActionState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { Product } from "@/lib/db/schema";

type FieldErrors = Record<string, string[]>;

function fieldError(
  state: ActionResult<FieldErrors> | null,
  field: string
): string | undefined {
  if (!state || state.success) return undefined;
  if (typeof state.error === "string") return undefined;
  return state.error[field]?.[0];
}

interface ProductFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
  product?: Product;
  submitLabel?: string;
}

export function ProductForm({
  action,
  product,
  submitLabel = "Uložit produkt",
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<FieldErrors> | null,
    FormData
  >(action as (prev: ActionResult<FieldErrors> | null, fd: FormData) => Promise<ActionResult<FieldErrors>>, null);

  const descriptionRef = useRef<HTMLInputElement>(null);

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

  // Sync initial value into hidden input after editor mounts
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

      {/* Název */}
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
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {fieldError(state, "name") && (
          <p className="text-xs text-destructive">{fieldError(state, "name")}</p>
        )}
      </div>

      {/* Popis — TipTap */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Popis</label>
        <div className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
          <EditorContent editor={editor} />
        </div>
        {/* Hidden input carries HTML content to the Server Action */}
        <input
          ref={descriptionRef}
          type="hidden"
          name="description"
          defaultValue={product?.description ?? ""}
        />
      </div>

      {/* Cena */}
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
            <p className="text-xs text-destructive">
              {fieldError(state, "price")}
            </p>
          )}
        </div>

        {/* Sklad */}
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
            <p className="text-xs text-destructive">
              {fieldError(state, "stock")}
            </p>
          )}
        </div>
      </div>

      {/* SKU */}
      <div className="space-y-1">
        <label htmlFor="sku" className="text-sm font-medium">
          SKU
        </label>
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
