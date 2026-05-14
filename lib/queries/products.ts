import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { PRODUCT_STATUS } from "@/lib/constants";
import type { Product, Category } from "@/lib/db/schema";

export async function getAdminProducts(adminUserId: string): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.adminUserId, adminUserId))
    .orderBy(desc(products.createdAt));
}

// Keep backward-compat alias used by existing admin pages
export const getProducts = getAdminProducts;

export async function getProductById(
  id: string,
  adminUserId: string
): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.adminUserId, adminUserId)))
    .limit(1);

  return product ?? null;
}

export async function getPublicProducts(
  categorySlug?: string
): Promise<(Product & { category: Category | null })[]> {
  const rows = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.status, PRODUCT_STATUS.ACTIVE),
        categorySlug
          ? eq(categories.slug, categorySlug)
          : undefined
      )
    )
    .orderBy(desc(products.createdAt));

  return rows.map(({ products: p, categories: c }) => ({
    ...p,
    category: c ?? null,
  }));
}

export async function getPublicProductBySlug(
  slug: string
): Promise<(Product & { category: Category | null }) | null> {
  const [row] = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.slug, slug),
        eq(products.status, PRODUCT_STATUS.ACTIVE)
      )
    )
    .limit(1);

  if (!row) return null;
  return { ...row.products, category: row.categories ?? null };
}

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(categories.name);
}
