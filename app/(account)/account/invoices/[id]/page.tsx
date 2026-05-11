import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId } from "@/lib/queries/account-orders";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Detail faktury" };
}

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

export default async function AccountInvoiceDetailPage({
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

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.customerId, customer.id)))
    .limit(1);

  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold font-mono">{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.createdAt.toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <Link
          href="/account/invoices"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-muted-foreground">Stav</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[invoice.status] ?? STATUS_CLASSES.draft}`}
              >
                {STATUS_LABELS[invoice.status] ?? invoice.status}
              </span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Částka</dt>
            <dd className="font-semibold tabular-nums">
              {Number(invoice.totalAmount).toLocaleString("cs-CZ", {
                style: "currency",
                currency: "CZK",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Datum splatnosti</dt>
            <dd>
              {invoice.dueDate
                ? invoice.dueDate.toLocaleDateString("cs-CZ")
                : "—"}
            </dd>
          </div>
          {invoice.issuedAt && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Datum vystavení</dt>
              <dd>{invoice.issuedAt.toLocaleDateString("cs-CZ")}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
