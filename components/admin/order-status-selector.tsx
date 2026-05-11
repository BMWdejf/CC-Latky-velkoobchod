"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { ActionResult } from "@/types";

const STATUS_OPTIONS = [
  { value: "draft", label: "Návrh" },
  { value: "pending", label: "Čeká na potvrzení" },
  { value: "confirmed", label: "Potvrzena" },
  { value: "shipped", label: "Expedována" },
  { value: "delivered", label: "Doručena" },
  { value: "cancelled", label: "Zrušena" },
] as const;

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelector({
  orderId,
  currentStatus,
}: OrderStatusSelectorProps) {
  const boundAction = updateOrderStatus.bind(null, orderId);
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(
    boundAction as (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>,
    null
  );

  const formError =
    state && !state.success && typeof state.error === "string"
      ? state.error
      : null;

  return (
    <form action={formAction} className="flex items-center gap-2">
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Ukládám…" : "Uložit stav"}
      </Button>
      {formError && (
        <span className="text-xs text-destructive">{formError}</span>
      )}
      {state?.success && (
        <span className="text-xs text-green-600 dark:text-green-400">
          Uloženo
        </span>
      )}
    </form>
  );
}
