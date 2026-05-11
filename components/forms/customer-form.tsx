"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
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

interface CustomerFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
  customer?: Customer;
  submitLabel?: string;
}

export function CustomerForm({
  action,
  customer,
  submitLabel = "Uložit zákazníka",
}: CustomerFormProps) {
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

  return (
    <form action={formAction} className="space-y-5">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      {/* Název firmy */}
      <div className="space-y-1">
        <label htmlFor="companyName" className="text-sm font-medium">
          Název firmy <span className="text-destructive">*</span>
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          required
          defaultValue={customer?.companyName}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {fieldError(state, "companyName") && (
          <p className="text-xs text-destructive">
            {fieldError(state, "companyName")}
          </p>
        )}
      </div>

      {/* Kontaktní osoba */}
      <div className="space-y-1">
        <label htmlFor="contactName" className="text-sm font-medium">
          Kontaktní osoba
        </label>
        <input
          id="contactName"
          name="contactName"
          type="text"
          defaultValue={customer?.contactName ?? ""}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Email + Telefon */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer?.email ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="info@firma.cz"
          />
          {fieldError(state, "email") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "email")}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={customer?.phone ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="+420 123 456 789"
          />
        </div>
      </div>

      {/* Adresa */}
      <div className="space-y-1">
        <label htmlFor="address" className="text-sm font-medium">
          Adresa
        </label>
        <textarea
          id="address"
          name="address"
          rows={2}
          defaultValue={customer?.address ?? ""}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Ulice 1, 110 00 Praha"
        />
      </div>

      {/* userId — propojení se zákaznickým účtem */}
      <div className="space-y-1">
        <label htmlFor="userId" className="text-sm font-medium">
          ID zákaznického účtu
          <span className="ml-1 text-xs text-muted-foreground">(volitelné)</span>
        </label>
        <input
          id="userId"
          name="userId"
          type="text"
          defaultValue={customer?.userId ?? ""}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="neon_auth user ID"
        />
        {fieldError(state, "userId") && (
          <p className="text-xs text-destructive">
            {fieldError(state, "userId")}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám…" : submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => history.back()}
        >
          Zrušit
        </Button>
      </div>
    </form>
  );
}
