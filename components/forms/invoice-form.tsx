"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { Customer } from "@/lib/db/schema";

type FieldErrors = Record<string, string[]>;

function fieldError(
  state: ActionResult<FieldErrors> | null,
  field: string
): string | undefined {
  if (!state || state.success) return undefined;
  if (typeof state.error === "string") return undefined;
  return state.error[field]?.[0];
}

interface InvoiceFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
  customers: Pick<Customer, "id" | "companyName">[];
}

export function InvoiceForm({ action, customers }: InvoiceFormProps) {
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

  const formError =
    state && !state.success && typeof state.error === "string"
      ? state.error
      : null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="customerId" className="text-sm font-medium">
          Zákazník <span className="text-destructive">*</span>
        </label>
        <select
          id="customerId"
          name="customerId"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">— Vyberte zákazníka —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName}
            </option>
          ))}
        </select>
        {fieldError(state, "customerId") && (
          <p className="text-xs text-destructive">{fieldError(state, "customerId")}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="totalAmount" className="text-sm font-medium">
          Částka (CZK) <span className="text-destructive">*</span>
        </label>
        <input
          id="totalAmount"
          name="totalAmount"
          type="number"
          min="0.01"
          step="0.01"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="0.00"
        />
        {fieldError(state, "totalAmount") && (
          <p className="text-xs text-destructive">{fieldError(state, "totalAmount")}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="dueDate" className="text-sm font-medium">
          Datum splatnosti <span className="text-destructive">*</span>
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          min={today}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {fieldError(state, "dueDate") && (
          <p className="text-xs text-destructive">{fieldError(state, "dueDate")}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám…" : "Vytvořit fakturu"}
        </Button>
        <Link
          href="/dashboard/invoices"
          className={buttonVariants({ variant: "ghost" })}
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
