import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import {
  getCustomerByUserId,
  getAccountOrderById,
} from "@/lib/queries/account-orders";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Detail objednávky" };
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Návrh",
  pending: "Čeká na potvrzení",
  confirmed: "Potvrzena",
  shipped: "Expedována",
  delivered: "Doručena",
  cancelled: "Zrušena",
};

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role === USER_ROLES.ADMIN) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);
  if (!customer) notFound();

  const order = await getAccountOrderById(id, customer.id);
  if (!order) notFound();

  const lineTotal = (qty: number, price: string) =>
    (qty * Number(price)).toLocaleString("cs-CZ", {
      style: "currency",
      currency: "CZK",
    });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-mono text-xl font-semibold">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {STATUS_LABELS[order.status] ?? order.status} ·{" "}
            {order.createdAt.toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <Link
          href="/account/orders"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      {order.notes && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          {order.notes}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produkt</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ks</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cena/ks</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Celkem</th>
            </tr>
          </thead>
          <tbody>
            {order.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Žádné položky.
                </td>
              </tr>
            ) : (
              order.items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium">{item.productName}</span>
                    {item.productSku && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {item.productSku}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {Number(item.unitPrice).toLocaleString("cs-CZ", {
                      style: "currency",
                      currency: "CZK",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">
                    {lineTotal(item.quantity, item.unitPrice)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/50">
              <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium">
                Celkem
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold">
                {Number(order.totalAmount).toLocaleString("cs-CZ", {
                  style: "currency",
                  currency: "CZK",
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
