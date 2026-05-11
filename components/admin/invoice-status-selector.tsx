"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";

const INVOICE_STATUS_OPTIONS = [
  { value: "draft", label: "Návrh" },
  { value: "issued", label: "Vystavena" },
  { value: "paid", label: "Zaplacena" },
  { value: "overdue", label: "Po splatnosti" },
  { value: "cancelled", label: "Zrušena" },
] as const;

interface InvoiceStatusSelectorProps {
  invoiceId: string;
  currentStatus: string;
  updateStatusAction: (
    invoiceId: string,
    prevState: unknown,
    formData: FormData
  ) => Promise<ActionResult>;
}

export function InvoiceStatusSelector({
  invoiceId,
  currentStatus,
  updateStatusAction,
}: InvoiceStatusSelectorProps) {
  const boundAction = updateStatusAction.bind(null, invoiceId);
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(
    boundAction as (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success("Stav faktury uložen");
    else if (typeof state.error === "string") toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {INVOICE_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Ukládám…" : "Uložit stav"}
      </Button>
    </form>
  );
}
