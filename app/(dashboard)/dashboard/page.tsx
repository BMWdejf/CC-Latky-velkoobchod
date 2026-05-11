import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

const statCards = [
  {
    label: "Celkový obrat",
    value: "—",
    icon: TrendingUp,
    description: "Bude doplněno ve Fázi 7",
  },
  {
    label: "Objednávky",
    value: "—",
    icon: ShoppingCart,
    description: "Bude doplněno ve Fázi 7",
  },
  {
    label: "Zákazníci",
    value: "—",
    icon: Users,
    description: "Bude doplněno ve Fázi 7",
  },
  {
    label: "Produkty na skladě",
    value: "—",
    icon: Package,
    description: "Bude doplněno ve Fázi 7",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Přehled</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, description }) => (
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

      <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
        <h2 className="text-sm font-medium text-muted-foreground">
          Graf příjmů
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bude implementováno ve Fázi 7 — Dashboard stats.
        </p>
      </div>
    </div>
  );
}
