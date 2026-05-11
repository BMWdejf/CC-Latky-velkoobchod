import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingCart, TrendingUp, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId, getAccountOrders } from "@/lib/queries/account-orders";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Přehled účtu" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  draft: "Návrh",
  pending: "Čeká na potvrzení",
  confirmed: "Potvrzena",
  shipped: "Expedována",
  delivered: "Doručena",
  cancelled: "Zrušena",
};

function formatAmount(amount: string): string {
  return Number(amount).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
  });
}

export default async function AccountPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.CUSTOMER) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);

  if (!customer) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Přehled</h1>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Váš účet zatím není propojen se zákaznickým profilem.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Kontaktujte správce pro přiřazení zákaznického účtu.
          </p>
        </div>
      </div>
    );
  }

  const orders = await getAccountOrders(customer.id);

  const totalSpent = orders
    .filter((o) => ["confirmed", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Přehled</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Celkem objednávek
            </span>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold">{orders.length}</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Celkem utraceno
            </span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold">
            {totalSpent.toLocaleString("cs-CZ", {
              style: "currency",
              currency: "CZK",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Čeká na potvrzení
            </span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold">{pendingCount}</div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Poslední objednávky</h2>
          <Link
            href="/account/orders"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Všechny →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Zatím žádné objednávky.
          </p>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Číslo</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stav</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Celkem</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Datum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/account/orders/${order.id}`} className="hover:underline font-medium">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatAmount(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {order.createdAt.toLocaleDateString("cs-CZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
