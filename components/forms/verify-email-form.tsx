"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VerifyEmailForm({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResend] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const { error } = await authClient.emailOtp.verifyEmail({ email, otp });
      if (error) {
        setError(error.message || "Neplatný kód. Zkuste to znovu.");
      } else {
        toast.success("E-mail byl úspěšně ověřen");
        router.push("/account");
      }
    });
  }

  function handleResend() {
    startResend(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      if (error) {
        toast.error(error.message || "Nepodařilo se odeslat kód");
      } else {
        toast.success("Nový kód byl odeslán");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-1">
        <label htmlFor="otp" className="text-sm font-medium">
          Ověřovací kód
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.trim())}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center tracking-widest"
          placeholder="000000"
          maxLength={8}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !otp}>
        {isPending ? "Ověřuji…" : "Ověřit e-mail"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Kód nedorazil?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-medium underline underline-offset-4 hover:text-primary disabled:opacity-50"
        >
          {isResending ? "Odesílám…" : "Odeslat znovu"}
        </button>
      </p>
    </form>
  );
}
