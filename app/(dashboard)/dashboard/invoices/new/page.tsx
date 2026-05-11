import Link from "next/link";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { createInvoice } from "@/lib/actions/invoices";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Nová faktura" };

export default async function NewInvoicePage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const customerList = await db
    .select({ id: customers.id, companyName: customers.companyName })
    .from(customers)
    .where(eq(customers.adminUserId, session.user.id))
    .orderBy(asc(customers.companyName));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nová faktura</h1>
        <Link
          href="/dashboard/invoices"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <InvoiceForm action={createInvoice} customers={customerList} />
      </div>
    </div>
  );
}
