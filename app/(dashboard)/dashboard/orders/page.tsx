import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getOrders } from "@/lib/queries/orders";
import { OrdersTable } from "@/components/admin/orders-table";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Objednávky" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const allOrders = await getOrders(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Objednávky</h1>
        <Link href="/dashboard/orders/new" className={buttonVariants()}>
          Nová objednávka
        </Link>
      </div>
      <OrdersTable orders={allOrders} />
    </div>
  );
}
