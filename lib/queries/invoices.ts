import { db } from "@/lib/db";
import { invoices, customers } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string | null;
  orderId: string | null;
  status: string;
  totalAmount: string;
  dueDate: Date | null;
  issuedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAdminInvoices(adminUserId: string): Promise<InvoiceRow[]> {
  return db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      customerId: invoices.customerId,
      customerName: customers.companyName,
      orderId: invoices.orderId,
      status: invoices.status,
      totalAmount: invoices.totalAmount,
      dueDate: invoices.dueDate,
      issuedAt: invoices.issuedAt,
      createdAt: invoices.createdAt,
      updatedAt: invoices.updatedAt,
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.adminUserId, adminUserId))
    .orderBy(desc(invoices.createdAt));
}

export async function getAdminInvoiceById(
  invoiceId: string,
  adminUserId: string
): Promise<InvoiceRow | null> {
  const [invoice] = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      customerId: invoices.customerId,
      customerName: customers.companyName,
      orderId: invoices.orderId,
      status: invoices.status,
      totalAmount: invoices.totalAmount,
      dueDate: invoices.dueDate,
      issuedAt: invoices.issuedAt,
      createdAt: invoices.createdAt,
      updatedAt: invoices.updatedAt,
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(and(eq(invoices.id, invoiceId), eq(invoices.adminUserId, adminUserId)))
    .limit(1);

  return invoice ?? null;
}
