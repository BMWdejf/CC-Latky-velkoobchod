"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";

const TICKET_STATUS_OPTIONS = [
  { value: "open", label: "Otevřen" },
  { value: "in_progress", label: "Zpracovává se" },
  { value: "resolved", label: "Vyřešen" },
  { value: "closed", label: "Uzavřen" },
] as const;

interface TicketStatusSelectorProps {
  ticketId: string;
  currentStatus: string;
  updateStatusAction: (
    ticketId: string,
    prevState: unknown,
    formData: FormData
  ) => Promise<ActionResult>;
}

export function TicketStatusSelector({
  ticketId,
  currentStatus,
  updateStatusAction,
}: TicketStatusSelectorProps) {
  const boundAction = updateStatusAction.bind(null, ticketId);
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
        {TICKET_STATUS_OPTIONS.map((opt) => (
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
