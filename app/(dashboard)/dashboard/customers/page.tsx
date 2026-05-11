import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomers } from "@/lib/queries/customers";
import { CustomersTable } from "@/components/admin/customers-table";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Zákazníci" };
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const allCustomers = await getCustomers(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Zákazníci</h1>
        <Link
          href="/dashboard/customers/new"
          className={buttonVariants()}
        >
          Přidat zákazníka
        </Link>
      </div>
      <CustomersTable customers={allCustomers} />
    </div>
  );
}
