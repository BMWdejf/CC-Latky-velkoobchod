"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { OrderRow } from "@/lib/queries/orders";

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

function formatAmount(amount: string): string {
  return Number(amount).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
  });
}

interface OrdersTableProps {
  orders: OrderRow[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Žádné objednávky. Vytvořte první objednávku.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Číslo
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Zákazník
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Stav
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              Celkem
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Datum
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              Akce
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-mono text-xs">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="font-medium hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {order.customerName ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[order.status] ?? STATUS_CLASSES.draft}`}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatAmount(order.totalAmount)}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {order.createdAt.toLocaleDateString("cs-CZ")}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Detail objednávky</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
