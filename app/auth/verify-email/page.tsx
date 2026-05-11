import Link from "next/link";

export const metadata = { title: "Ověřte svůj e-mail" };

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Zkontrolujte svůj e-mail</h1>
        <p className="text-sm text-muted-foreground">
          Poslali jsme vám odkaz pro ověření účtu. Klikněte na něj a přihlaste
          se.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Nenašli jste e-mail? Zkontrolujte složku se spamem.
      </p>

      <Link
        href="/auth/login"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Zpět na přihlášení
      </Link>
    </div>
  );
}
