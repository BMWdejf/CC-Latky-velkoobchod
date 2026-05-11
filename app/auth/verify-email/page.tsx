import Link from "next/link";
import { VerifyEmailForm } from "@/components/forms/verify-email-form";

export const metadata = { title: "Ověřte svůj e-mail" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ověřte svůj e-mail
        </h1>
        <p className="text-sm text-muted-foreground">
          Odeslali jsme ověřovací kód na{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "váš e-mail"
          )}
          .
        </p>
      </div>

      <VerifyEmailForm email={email} />

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Zpět na přihlášení
        </Link>
      </p>
    </div>
  );
}
