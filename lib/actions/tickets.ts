"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tickets, ticketMessages, customers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  createTicketSchema,
  addMessageSchema,
  updateTicketStatusSchema,
} from "@/lib/validations/tickets";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId } from "@/lib/queries/account-orders";
import type { ActionResult } from "@/types";

async function requireSession() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  return session;
}

// ── createTicket (customer only) ───────────────────────────────────────────

export async function createTicket(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (session.user.role !== USER_ROLES.CUSTOMER) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);
  if (!customer) {
    return {
      success: false,
      error: "Váš účet není propojen se zákaznickým profilem.",
    };
  }

  const validated = createTicketSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const [inserted] = await db
    .insert(tickets)
    .values({
      subject: validated.data.subject,
      customerId: customer.id,
    })
    .returning({ id: tickets.id });

  await db.insert(ticketMessages).values({
    ticketId: inserted.id,
    authorId: session.user.id,
    body: validated.data.body,
  });

  revalidatePath("/account/support");
  redirect(`/account/support/${inserted.id}`);
}

// ── addMessage (customer or admin) ────────────────────────────────────────

export async function addMessage(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  const role = session.user.role as string;

  const validated = addMessageSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const { ticketId, body } = validated.data;

  // Verify access: customer sees only their tickets; admin sees only their customers' tickets
  if (role === USER_ROLES.CUSTOMER) {
    const customer = await getCustomerByUserId(session.user.id);
    if (!customer) {
      return { success: false, error: "Přístup odepřen." };
    }
    const [ticket] = await db
      .select({ id: tickets.id, status: tickets.status })
      .from(tickets)
      .where(
        and(eq(tickets.id, ticketId), eq(tickets.customerId, customer.id))
      )
      .limit(1);

    if (!ticket) {
      return { success: false, error: "Ticket nenalezen." };
    }
    if (ticket.status === "closed" || ticket.status === "resolved") {
      return { success: false, error: "Ticket je uzavřen." };
    }
  } else if (role === USER_ROLES.ADMIN) {
    const [result] = await db
      .select({ id: tickets.id })
      .from(tickets)
      .innerJoin(customers, eq(tickets.customerId, customers.id))
      .where(
        and(
          eq(tickets.id, ticketId),
          eq(customers.adminUserId, session.user.id)
        )
      )
      .limit(1);

    if (!result) {
      return { success: false, error: "Ticket nenalezen." };
    }
  } else {
    return { success: false, error: "Přístup odepřen." };
  }

  await db.insert(ticketMessages).values({
    ticketId,
    authorId: session.user.id,
    body,
  });

  revalidatePath(`/dashboard/support/${ticketId}`);
  revalidatePath(`/account/support/${ticketId}`);
  return { success: true };
}

// ── updateTicketStatus (admin only) ───────────────────────────────────────

export async function updateTicketStatus(
  ticketId: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const validated = updateTicketStatusSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  // Verify admin owns the customer who owns this ticket
  const [result] = await db
    .select({ id: tickets.id })
    .from(tickets)
    .innerJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      and(
        eq(tickets.id, ticketId),
        eq(customers.adminUserId, session.user.id)
      )
    )
    .limit(1);

  if (!result) {
    return { success: false, error: "Ticket nenalezen." };
  }

  await db
    .update(tickets)
    .set({ status: validated.data.status, updatedAt: new Date() })
    .where(eq(tickets.id, ticketId));

  revalidatePath(`/dashboard/support/${ticketId}`);
  revalidatePath("/dashboard/support");
  return { success: true };
}
