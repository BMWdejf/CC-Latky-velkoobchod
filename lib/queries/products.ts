import { db } from "@/lib/db";
import { products, categories, productImages } from "@/lib/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { PRODUCT_STATUS } from "@/lib/constants";
import type { Product, Category, ProductImage } from "@/lib/db/schema";

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
): Promise<(Product & { images: ProductImage[] }) | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.adminUserId, adminUserId)))
    .limit(1);

  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.position));

  return { ...product, images };
}

export async function getPublicProducts(
  categorySlug?: string
): Promise<(Product & { category: Category | null; coverImage: string | null })[]> {
  const rows = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.status, PRODUCT_STATUS.ACTIVE),
        categorySlug ? eq(categories.slug, categorySlug) : undefined
      )
    )
    .orderBy(desc(products.createdAt));

  // Fetch cover images (position=0) for all returned products
  const productIds = rows.map((r) => r.products.id);
  const coverImages =
    productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(
            and(
              eq(productImages.position, 0),
              productIds.length === 1
                ? eq(productImages.productId, productIds[0])
                : undefined
            )
          )
          .orderBy(asc(productImages.position))
      : [];

  const coverMap = new Map(coverImages.map((img) => [img.productId, img.url]));

  return rows.map(({ products: p, categories: c }) => ({
    ...p,
    category: c ?? null,
    coverImage: coverMap.get(p.id) ?? null,
  }));
}

export async function getPublicProductBySlug(
  slug: string
): Promise<(Product & { category: Category | null; images: ProductImage[] }) | null> {
  const [row] = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(eq(products.slug, slug), eq(products.status, PRODUCT_STATUS.ACTIVE))
    )
    .limit(1);

  if (!row) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, row.products.id))
    .orderBy(asc(productImages.position));

  return { ...row.products, category: row.categories ?? null, images };
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.position));
}

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(categories.name);
}
