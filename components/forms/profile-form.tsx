"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { Profile } from "@/lib/db/schema";

type FieldErrors = Record<string, string[]>;

function fieldError(
  state: ActionResult<FieldErrors> | null,
  field: string
): string | undefined {
  if (!state || state.success) return undefined;
  if (typeof state.error === "string") return undefined;
  return state.error[field]?.[0];
}

interface ProfileFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
  profile?: Profile | null;
}

export function ProfileForm({ action, profile }: ProfileFormProps) {
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
    <form action={formAction} className="space-y-4">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
          Profil byl uložen.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="firstName" className="text-sm font-medium">
            Jméno <span className="text-destructive">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={profile?.firstName ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "firstName") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "firstName")}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="text-sm font-medium">
            Příjmení <span className="text-destructive">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            defaultValue={profile?.lastName ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldError(state, "lastName") && (
            <p className="text-xs text-destructive">
              {fieldError(state, "lastName")}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Ukládám…" : "Uložit profil"}
      </Button>
    </form>
  );
}
