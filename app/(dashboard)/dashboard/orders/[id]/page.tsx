import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getOrderById } from "@/lib/queries/orders";
import { getProducts } from "@/lib/queries/products";
import { removeOrderItem } from "@/lib/actions/orders";
import { OrderStatusSelector } from "@/components/admin/order-status-selector";
import { AddOrderItemForm } from "@/components/admin/add-order-item-form";
import { Button, buttonVariants } from "@/components/ui/button";

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

function formatAmount(amount: string): string {
  return Number(amount).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const [order, allProducts] = await Promise.all([
    getOrderById(id, session.user.id),
    getProducts(session.user.id),
  ]);

  if (!order) notFound();

  const isEditable = order.status !== "delivered" && order.status !== "cancelled";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-mono text-xl font-semibold">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.customerName ?? "Bez zákazníka"} ·{" "}
            {order.createdAt.toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      {/* Status */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Stav objednávky
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
          {isEditable && (
            <OrderStatusSelector
              orderId={order.id}
              currentStatus={order.status}
            />
          )}
        </div>
        {order.notes && (
          <p className="text-sm text-muted-foreground border-t border-border pt-3">
            {order.notes}
          </p>
        )}
      </section>

      {/* Items */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Položky objednávky
        </h2>

        {order.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Žádné položky.</p>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Produkt
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Ks
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Cena/ks
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Celkem
                  </th>
                  {isEditable && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">{item.productName}</span>
                      {item.productSku && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {item.productSku}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatAmount(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatAmount(
                        String(item.quantity * Number(item.unitPrice))
                      )}
                    </td>
                    {isEditable && (
                      <td className="px-4 py-3 text-right">
                        <form
                          action={removeOrderItem.bind(null, order.id, item.id)}
                          onSubmit={(e) => {
                            if (!confirm("Odebrat tuto položku?"))
                              e.preventDefault();
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            type="submit"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Odebrat</span>
                          </Button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/50">
                  <td
                    colSpan={isEditable ? 3 : 3}
                    className="px-4 py-3 text-right text-sm font-medium"
                  >
                    Celkem
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatAmount(order.totalAmount)}
                  </td>
                  {isEditable && <td />}
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {isEditable && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-medium">Přidat položku</h3>
            <AddOrderItemForm orderId={order.id} products={allProducts} />
          </div>
        )}
      </section>
    </div>
  );
}
