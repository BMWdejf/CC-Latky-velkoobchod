import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "inactive",
]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", {
      precision: 10,
      scale: 2,
    }),
    stock: integer("stock").default(0).notNull(),
    sku: text("sku").unique(),
    weight: numeric("weight", { precision: 8, scale: 2 }),
    dimensions: text("dimensions"),
    status: productStatusEnum("status").default("inactive").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "restrict",
    }),
    adminUserId: text("admin_user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("products_admin_user_id_idx").on(table.adminUserId),
    index("products_sku_idx").on(table.sku),
    index("products_slug_idx").on(table.slug),
    index("products_status_idx").on(table.status),
    index("products_category_id_idx").on(table.categoryId),
  ]
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
