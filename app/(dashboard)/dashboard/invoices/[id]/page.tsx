import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getAdminInvoiceById } from "@/lib/queries/invoices";
import { updateInvoiceStatus } from "@/lib/actions/invoices";
import { InvoiceStatusSelector } from "@/components/admin/invoice-status-selector";
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

function formatAmount(amount: string): string {
  return Number(amount).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
  });
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const invoice = await getAdminInvoiceById(id, session.user.id);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-mono">{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.customerName} · Vytvořena{" "}
            {invoice.createdAt.toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <Link
          href="/dashboard/invoices"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Invoice info */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Informace
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Zákazník</dt>
              <dd className="font-medium">{invoice.customerName ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Částka</dt>
              <dd className="font-semibold tabular-nums">
                {formatAmount(invoice.totalAmount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Splatnost</dt>
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
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Stav</dt>
              <dd>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[invoice.status] ?? STATUS_CLASSES.draft}`}
                >
                  {STATUS_LABELS[invoice.status] ?? invoice.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Status change */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Změna stavu
          </h2>
          <InvoiceStatusSelector
            invoiceId={invoice.id}
            currentStatus={invoice.status}
            updateStatusAction={updateInvoiceStatus}
          />
        </div>
      </div>
    </div>
  );
}
