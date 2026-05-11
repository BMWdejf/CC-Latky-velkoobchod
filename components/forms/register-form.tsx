"use client";

import { useActionState } from "react";
import { signUpWithEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [state, action, isPending] = useActionState(signUpWithEmail, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Celé jméno
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Jan Novák"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="vas@email.cz"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Registruji…" : "Vytvořit účet"}
      </Button>
    </form>
  );
}
