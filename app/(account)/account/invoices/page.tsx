import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId } from "@/lib/queries/account-orders";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata = { title: "Moje faktury" };
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

export default async function AccountInvoicesPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role === USER_ROLES.ADMIN) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);
  const customerInvoices = customer
    ? await db
        .select()
        .from(invoices)
        .where(eq(invoices.customerId, customer.id))
        .orderBy(desc(invoices.createdAt))
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Moje faktury</h1>

      {customerInvoices.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Zatím žádné faktury.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Číslo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stav</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Částka</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Splatnost</th>
              </tr>
            </thead>
            <tbody>
              {customerInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    <Link href={`/account/invoices/${inv.id}`} className="hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[inv.status] ?? STATUS_CLASSES.draft}`}>
                      {STATUS_LABELS[inv.status] ?? inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {Number(inv.totalAmount).toLocaleString("cs-CZ", {
                      style: "currency",
                      currency: "CZK",
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {inv.dueDate
                      ? inv.dueDate.toLocaleDateString("cs-CZ")
                      : "—"}
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
