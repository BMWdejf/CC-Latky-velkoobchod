import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getAdminInvoices } from "@/lib/queries/invoices";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Faktury" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  draft: "Návrh",
  issued: "Vystavena",
  paid: "Zaplacena",
  overdue: "Po splatnosti",
  cancelled: "Zrušena",
};

const STATUS_CLASSES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  issued: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-muted text-muted-foreground",
};

function formatAmount(amount: string): string {
  return Number(amount).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
  });
}

export default async function InvoicesPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const allInvoices = await getAdminInvoices(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Faktury</h1>
        <Link href="/dashboard/invoices/new" className={buttonVariants()}>
          Nová faktura
        </Link>
      </div>

      {allInvoices.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Žádné faktury.{" "}
          <Link href="/dashboard/invoices/new" className="underline">
            Vytvořte první fakturu
          </Link>
          .
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Číslo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Zákazník</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stav</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Částka</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Splatnost</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Akce</th>
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{inv.customerName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[inv.status] ?? STATUS_CLASSES.draft}`}>
                      {STATUS_LABELS[inv.status] ?? inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatAmount(inv.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {inv.dueDate ? inv.dueDate.toLocaleDateString("cs-CZ") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/invoices/${inv.id}`}
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
