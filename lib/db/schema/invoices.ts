import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { customers } from "./customers";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "issued",
  "paid",
  "overdue",
  "cancelled",
]);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceNumber: text("invoice_number").unique().notNull(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "restrict",
    }),
    customerId: uuid("customer_id")
      .references(() => customers.id, { onDelete: "restrict" })
      .notNull(),
    status: invoiceStatusEnum("status").default("draft").notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    dueDate: timestamp("due_date"),
    issuedAt: timestamp("issued_at"),
    adminUserId: text("admin_user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("invoices_customer_id_idx").on(table.customerId),
    index("invoices_status_idx").on(table.status),
    index("invoices_admin_user_id_idx").on(table.adminUserId),
  ]
);

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
