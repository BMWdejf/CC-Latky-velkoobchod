import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { CustomerForm } from "@/components/forms/customer-form";
import { createCustomer } from "@/lib/actions/customers";

export const metadata = { title: "Nový zákazník" };
export const dynamic = "force-dynamic";

export default async function NewCustomerPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Nový zákazník</h1>
      <CustomerForm action={createCustomer} submitLabel="Vytvořit zákazníka" />
    </div>
  );
}
