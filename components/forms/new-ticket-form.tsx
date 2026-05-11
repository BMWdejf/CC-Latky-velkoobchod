"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { createTicket } from "@/lib/actions/tickets";
import type { ActionResult } from "@/types";

type FieldErrors = Record<string, string[]>;

function fieldError(
  state: ActionResult<FieldErrors> | null,
  field: string
): string | undefined {
  if (!state || state.success) return undefined;
  if (typeof state.error === "string") return undefined;
  return state.error[field]?.[0];
}

export function NewTicketForm() {
  const [state, formAction, isPending] = useActionState<
    ActionResult<FieldErrors> | null,
    FormData
  >(
    createTicket as (
      prev: ActionResult<FieldErrors> | null,
      fd: FormData
    ) => Promise<ActionResult<FieldErrors>>,
    null
  );

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

      <div className="space-y-1">
        <label htmlFor="subject" className="text-sm font-medium">
          Předmět <span className="text-destructive">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Stručný popis problému"
        />
        {fieldError(state, "subject") && (
          <p className="text-xs text-destructive">{fieldError(state, "subject")}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="body" className="text-sm font-medium">
          Zpráva <span className="text-destructive">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Popište svůj dotaz nebo problém…"
        />
        {fieldError(state, "body") && (
          <p className="text-xs text-destructive">{fieldError(state, "body")}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Odesílám…" : "Odeslat tiket"}
        </Button>
        <Link
          href="/account/support"
          className={buttonVariants({ variant: "ghost" })}
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
