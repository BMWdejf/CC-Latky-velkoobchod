import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata = {
  title: "Registrace",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Registrace</h1>
        <p className="text-sm text-muted-foreground">
          Vytvořte si nový zákaznický účet
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Máte již účet?{" "}
        <Link
          href="/auth/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Přihlaste se
        </Link>
      </p>
    </div>
  );
}
