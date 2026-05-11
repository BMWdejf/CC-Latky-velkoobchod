import { db } from "@/lib/db";
import { tickets, ticketMessages, customers } from "@/lib/db/schema";
import { eq, and, asc, desc, sql } from "drizzle-orm";

export type TicketRow = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  customerName: string | null;
};

export type TicketMessageRow = {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  createdAt: Date;
};

export type TicketDetail = TicketRow & {
  messages: TicketMessageRow[];
};

// ── Admin queries ──────────────────────────────────────────────────────────

export async function getAdminTickets(adminUserId: string): Promise<TicketRow[]> {
  return db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      priority: tickets.priority,
      customerId: tickets.customerId,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      customerName: customers.companyName,
    })
    .from(tickets)
    .innerJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(customers.adminUserId, adminUserId))
    .orderBy(desc(tickets.updatedAt));
}

export async function getAdminTicketById(
  ticketId: string,
  adminUserId: string
): Promise<TicketDetail | null> {
  const [ticket] = await db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      priority: tickets.priority,
      customerId: tickets.customerId,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      customerName: customers.companyName,
    })
    .from(tickets)
    .innerJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      and(eq(tickets.id, ticketId), eq(customers.adminUserId, adminUserId))
    )
    .limit(1);

  if (!ticket) return null;

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticketId))
    .orderBy(asc(ticketMessages.createdAt));

  return { ...ticket, messages };
}

// ── Customer queries ───────────────────────────────────────────────────────

export async function getCustomerTickets(
  customerId: string
): Promise<TicketRow[]> {
  return db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      priority: tickets.priority,
      customerId: tickets.customerId,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      customerName: sql<string | null>`NULL`,
    })
    .from(tickets)
    .where(eq(tickets.customerId, customerId))
    .orderBy(desc(tickets.updatedAt));
}

export async function getCustomerTicketById(
  ticketId: string,
  customerId: string
): Promise<TicketDetail | null> {
  const [ticket] = await db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      priority: tickets.priority,
      customerId: tickets.customerId,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      customerName: sql<string | null>`NULL`,
    })
    .from(tickets)
    .where(
      and(eq(tickets.id, ticketId), eq(tickets.customerId, customerId))
    )
    .limit(1);

  if (!ticket) return null;

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticketId))
    .orderBy(asc(ticketMessages.createdAt));

  return { ...ticket, messages };
}
