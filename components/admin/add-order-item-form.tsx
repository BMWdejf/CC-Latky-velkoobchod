"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { addOrderItem } from "@/lib/actions/orders";
import type { ActionResult } from "@/types";
import type { Product } from "@/lib/db/schema";

type FieldErrors = Record<string, string[]>;

interface AddOrderItemFormProps {
  orderId: string;
  products: Pick<Product, "id" | "name" | "sku" | "price">[];
}

export function AddOrderItemForm({ orderId, products }: AddOrderItemFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<FieldErrors> | null,
    FormData
  >(
    addOrderItem as (
      prev: ActionResult<FieldErrors> | null,
      fd: FormData
    ) => Promise<ActionResult<FieldErrors>>,
    null
  );

  const formError =
    state && !state.success && typeof state.error === "string"
      ? state.error
      : null;

  function fieldError(field: string): string | undefined {
    if (!state || state.success) return undefined;
    if (typeof state.error === "string") return undefined;
    return state.error[field]?.[0];
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nejsou žádné dostupné produkty.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <div className="space-y-1">
        <label htmlFor="productId" className="text-sm font-medium">
          Produkt
        </label>
        <select
          id="productId"
          name="productId"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.sku ? ` (${p.sku})` : ""} — {Number(p.price).toLocaleString("cs-CZ")} Kč
            </option>
          ))}
        </select>
        {fieldError("productId") && (
          <p className="text-xs text-destructive">{fieldError("productId")}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="quantity" className="text-sm font-medium">
          Množství
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {fieldError("quantity") && (
          <p className="text-xs text-destructive">{fieldError("quantity")}</p>
        )}
      </div>

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Přidávám…" : "Přidat položku"}
      </Button>

      {formError && (
        <p className="w-full text-xs text-destructive">{formError}</p>
      )}
      {state?.success && (
        <p className="w-full text-xs text-green-600 dark:text-green-400">
          Položka přidána
        </p>
      )}
    </form>
  );
}
