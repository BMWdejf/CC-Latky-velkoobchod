import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getUsers } from "@/lib/queries/users";
import { UsersTable } from "@/components/admin/users-table";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Zákazníci" };
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const allUsers = await getUsers();

  const nonAdminUsers = allUsers.filter((u) => u.role !== USER_ROLES.ADMIN);

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
      <UsersTable users={nonAdminUsers} />
    </div>
  );
}
