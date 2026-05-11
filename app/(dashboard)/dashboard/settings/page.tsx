import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getAdminProfile, upsertAdminProfile } from "@/lib/actions/settings";
import { ProfileForm } from "@/components/forms/profile-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = { title: "Nastavení" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const profile = await getAdminProfile(session.user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="text-2xl font-semibold">Nastavení</h1>

      {/* Profil */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Profil</h2>
        <div className="rounded-lg border border-border bg-card p-5">
          <ProfileForm action={upsertAdminProfile} profile={profile} />
        </div>
      </section>

      {/* Účet */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Účet</h2>
        <div className="rounded-lg border border-border bg-card p-5">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1 border-b border-border">
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="font-medium">{session.user.email ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between py-1">
              <dt className="text-muted-foreground">Role</dt>
              <dd>
                <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Admin
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Vzhled */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Vzhled</h2>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Barevné téma</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Přepínání mezi světlým a tmavým režimem
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>
    </div>
  );
}
