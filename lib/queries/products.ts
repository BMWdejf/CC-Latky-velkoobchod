import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { Product } from "@/lib/db/schema";

export async function getProducts(adminUserId: string): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.adminUserId, adminUserId))
    .orderBy(desc(products.createdAt));
}

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
