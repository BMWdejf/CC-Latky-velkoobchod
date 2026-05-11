import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const companyDetails = pgTable("company_details", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(), // FK → neon_auth.users.id

  // Firemní identifikace
  companyName: text("company_name"),
  ico: text("ico"),
  vatNumber: text("vat_number"),

  // Fakturační adresa
  invoiceStreet: text("invoice_street"),
  invoiceCity: text("invoice_city"),
  invoiceZipCode: text("invoice_zip_code"),
  invoicePhone: text("invoice_phone"),

  // Dodací adresa
  sendingStreet: text("sending_street"),
  sendingCity: text("sending_city"),
  sendingZipCode: text("sending_zip_code"),
  sendingPhone: text("sending_phone"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CompanyDetail = typeof companyDetails.$inferSelect;
export type NewCompanyDetail = typeof companyDetails.$inferInsert;
