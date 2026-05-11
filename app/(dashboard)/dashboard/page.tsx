import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getDashboardStats } from "@/lib/queries/stats";
import { StatsCards } from "@/components/admin/stats-cards";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { OrdersChart } from "@/components/charts/orders-chart";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Přehled</h1>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Příjmy (posledních 6 měsíců)
          </h2>
          <RevenueChart data={stats.revenueByMonth} />
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Objednávky podle stavu
          </h2>
          <OrdersChart data={stats.ordersByStatus} />
        </div>
      </div>
    </div>
  );
}
