import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getProfile, upsertProfile } from "@/lib/actions/profile";
import { getCompanyDetails, upsertCompanyDetails } from "@/lib/actions/company-details";
import { ProfileForm } from "@/components/forms/profile-form";
import { CompanyDetailsForm } from "@/components/forms/company-details-form";

export const metadata = { title: "Profil" };
export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role === USER_ROLES.ADMIN) redirect("/dashboard");

  const [profile, details] = await Promise.all([
    getProfile(session.user.id),
    getCompanyDetails(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="text-2xl font-semibold">Profil</h1>

      {/* Osobní údaje */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Osobní údaje</h2>
        <div className="rounded-lg border border-border bg-card p-5">
          <ProfileForm action={upsertProfile} profile={profile} />
        </div>
      </section>

      {/* Firemní údaje */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Firemní údaje a adresy</h2>
        <div className="rounded-lg border border-border bg-card p-5">
          <CompanyDetailsForm action={upsertCompanyDetails} details={details} />
        </div>
      </section>
    </div>
  );
}
