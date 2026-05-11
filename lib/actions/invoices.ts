"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { USER_ROLES } from "@/lib/constants";
import {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
} from "@/lib/validations/invoices";
import type { ActionResult } from "@/types";

type FieldErrors = Record<string, string[]>;

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

function generateInvoiceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${dateStr}-${rand}`;
}

export async function createInvoice(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult<FieldErrors>> {
  const session = await requireAdmin();

  const raw = {
    customerId: formData.get("customerId"),
    totalAmount: formData.get("totalAmount"),
    dueDate: formData.get("dueDate"),
  };

  const parsed = createInvoiceSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors as FieldErrors,
    };
  }

  const { customerId, totalAmount, dueDate } = parsed.data;
  const invoiceNumber = generateInvoiceNumber();

  const [inserted] = await db
    .insert(invoices)
    .values({
      invoiceNumber,
      customerId,
      totalAmount: String(totalAmount),
      dueDate: new Date(dueDate),
      adminUserId: session.user.id,
    })
    .returning({ id: invoices.id });

  redirect(`/dashboard/invoices/${inserted.id}`);
}

export async function updateInvoiceStatus(
  invoiceId: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const parsed = updateInvoiceStatusSchema.safeParse({
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { success: false, error: "Neplatný stav faktury" };
  }

  const { status } = parsed.data;
  const issuedAt = status === "issued" ? new Date() : undefined;

  const [updated] = await db
    .update(invoices)
    .set({
      status,
      ...(issuedAt ? { issuedAt } : {}),
      updatedAt: new Date(),
    })
    .where(
      and(eq(invoices.id, invoiceId), eq(invoices.adminUserId, session.user.id))
    )
    .returning({ id: invoices.id });

  if (!updated) {
    return { success: false, error: "Faktura nenalezena nebo nemáte přístup" };
  }

  return { success: true };
}
