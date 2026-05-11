import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { DashboardStats } from "@/lib/queries/stats";

const STATUS_LABELS: Record<string, string> = {
  draft: "Návrh",
  pending: "Čeká",
  confirmed: "Potvrzena",
  shipped: "Expedována",
  delivered: "Doručena",
  cancelled: "Zrušena",
};

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Celkový obrat",
      value: stats.totalRevenue.toLocaleString("cs-CZ", {
        style: "currency",
        currency: "CZK",
        maximumFractionDigits: 0,
      }),
      icon: TrendingUp,
      description: "Potvrzené + expedované + doručené objednávky",
    },
    {
      label: "Objednávky",
      value: String(stats.totalOrders),
      icon: ShoppingCart,
      description: `${stats.ordersByStatus.find((s) => s.status === "pending")?.count ?? 0} čeká na potvrzení`,
    },
    {
      label: "Zákazníci",
      value: String(stats.totalCustomers),
      icon: Users,
      description: "Registrovaní zákazníci",
    },
    {
      label: "Produkty",
      value: String(stats.totalProducts),
      icon: Package,
      description: `${stats.lowStockProducts.length} produktů s nízkým skladem`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, description }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Nízký sklad
            </span>
          </div>
          <ul className="space-y-1">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id} className="text-xs text-amber-700 dark:text-amber-400">
                <Link
                  href={`/dashboard/products/${p.id}`}
                  className="hover:underline"
                >
                  {p.name}
                  {p.sku ? ` (${p.sku})` : ""}
                </Link>
                {" — "}
                <span className="font-semibold">{p.stock} ks</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.ordersByStatus.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Objednávky podle stavu
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.ordersByStatus.map((s) => (
              <span
                key={s.status}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
              >
                <span className="text-muted-foreground">
                  {STATUS_LABELS[s.status] ?? s.status}
                </span>
                <span className="font-semibold">{s.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
