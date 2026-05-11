import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerById } from "@/lib/queries/customers";
import { updateCustomer } from "@/lib/actions/customers";
import { CustomerForm } from "@/components/forms/customer-form";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Detail zákazníka" };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const customer = await getCustomerById(id, session.user.id);
  if (!customer) notFound();

  const updateCustomerWithId = updateCustomer.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{customer.companyName}</h1>
        <Link
          href="/dashboard/customers"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      <CustomerForm
        action={updateCustomerWithId}
        customer={customer}
        submitLabel="Uložit změny"
      />
    </div>
  );
}
