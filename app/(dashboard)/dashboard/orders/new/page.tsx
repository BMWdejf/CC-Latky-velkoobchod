import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomers } from "@/lib/queries/customers";
import { createOrder } from "@/lib/actions/orders";
import { OrderForm } from "@/components/forms/order-form";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Nová objednávka" };
export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const customers = await getCustomers(session.user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nová objednávka</h1>
        <Link
          href="/dashboard/orders"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>
      <OrderForm action={createOrder} customers={customers} />
    </div>
  );
}
