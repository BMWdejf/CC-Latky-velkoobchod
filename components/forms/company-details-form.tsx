"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { CompanyDetail } from "@/lib/db/schema";

type FieldErrors = Record<string, string[]>;

interface CompanyDetailsFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
  details?: CompanyDetail | null;
}

function Input({
  id,
  label,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

export function CompanyDetailsForm({ action, details }: CompanyDetailsFormProps) {
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
    <form action={formAction} className="space-y-6">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
          Firemní údaje byly uloženy.
        </p>
      )}

      {/* Firma */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Identifikace firmy
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <Input
              id="companyName"
              label="Název firmy"
              defaultValue={details?.companyName}
              placeholder="Textil s.r.o."
            />
          </div>
          <Input
            id="ico"
            label="IČO"
            defaultValue={details?.ico}
            placeholder="12345678"
          />
          <Input
            id="vatNumber"
            label="DIČ"
            defaultValue={details?.vatNumber}
            placeholder="CZ12345678"
          />
        </div>
      </div>

      {/* Fakturační adresa */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Fakturační adresa
        </h3>
        <Input
          id="invoiceStreet"
          label="Ulice a číslo popisné"
          defaultValue={details?.invoiceStreet}
          placeholder="Textilní 123"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="invoiceCity"
            label="Město"
            defaultValue={details?.invoiceCity}
            placeholder="Praha"
          />
          <Input
            id="invoiceZipCode"
            label="PSČ"
            defaultValue={details?.invoiceZipCode}
            placeholder="110 00"
          />
        </div>
        <Input
          id="invoicePhone"
          label="Telefon"
          defaultValue={details?.invoicePhone}
          placeholder="+420 123 456 789"
        />
      </div>

      {/* Dodací adresa */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Dodací adresa
        </h3>
        <Input
          id="sendingStreet"
          label="Ulice a číslo popisné"
          defaultValue={details?.sendingStreet}
          placeholder="Dodací 456"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="sendingCity"
            label="Město"
            defaultValue={details?.sendingCity}
            placeholder="Brno"
          />
          <Input
            id="sendingZipCode"
            label="PSČ"
            defaultValue={details?.sendingZipCode}
            placeholder="602 00"
          />
        </div>
        <Input
          id="sendingPhone"
          label="Telefon"
          defaultValue={details?.sendingPhone}
          placeholder="+420 987 654 321"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Ukládám…" : "Uložit firemní údaje"}
      </Button>
    </form>
  );
}
