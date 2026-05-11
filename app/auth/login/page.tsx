import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata = {
  title: "Přihlášení",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Přihlášení</h1>
        <p className="text-sm text-muted-foreground">
          Zadejte svůj email a heslo
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Nemáte účet?{" "}
        <Link
          href="/auth/register"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Registrujte se
        </Link>
      </p>
    </div>
  );
}
