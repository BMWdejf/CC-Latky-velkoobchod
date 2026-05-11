import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId, getAccountOrders } from "@/lib/queries/account-orders";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Moje objednávky" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  draft: "Návrh",
  pending: "Čeká na potvrzení",
  confirmed: "Potvrzena",
  shipped: "Expedována",
  delivered: "Doručena",
  cancelled: "Zrušena",
};

const STATUS_CLASSES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AccountOrdersPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.CUSTOMER) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);
  const orders = customer ? await getAccountOrders(customer.id) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Moje objednávky</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Zatím žádné objednávky.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Číslo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stav</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Celkem</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Datum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Detail</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[order.status] ?? STATUS_CLASSES.draft}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {Number(order.totalAmount).toLocaleString("cs-CZ", {
                      style: "currency",
                      currency: "CZK",
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {order.createdAt.toLocaleDateString("cs-CZ")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
