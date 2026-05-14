"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { productImages, products } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { USER_ROLES } from "@/lib/constants";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

export async function addProductImage(
  productId: string,
  url: string,
  alt?: string,
  position?: number
): Promise<void> {
  const session = await requireAdmin();

  // Ownership check
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(
      and(eq(products.id, productId), eq(products.adminUserId, session.user.id))
    )
    .limit(1);

  if (!product) return;

  await db.insert(productImages).values({ productId, url, alt, position: position ?? 0 });

  revalidatePath(`/dashboard/products/${productId}`);
  revalidatePath(`/dashboard/products/${productId}/edit`);
}

export async function deleteProductImage(id: string): Promise<void> {
  const session = await requireAdmin();

  const [image] = await db
    .select({
      url: productImages.url,
      productId: productImages.productId,
      adminUserId: products.adminUserId,
    })
    .from(productImages)
    .innerJoin(products, eq(productImages.productId, products.id))
    .where(
      and(eq(productImages.id, id), eq(products.adminUserId, session.user.id))
    )
    .limit(1);

  if (!image) return;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(image.url);
    } catch (err) {
      console.error("[deleteProductImage] Blob del failed:", err);
    }
  }

  await db.delete(productImages).where(eq(productImages.id, id));

  revalidatePath(`/dashboard/products/${image.productId}`);
  revalidatePath(`/dashboard/products/${image.productId}/edit`);
  revalidatePath("/katalog");
}

export async function reorderProductImages(
  productId: string,
  orderedIds: string[]
): Promise<void> {
  const session = await requireAdmin();

  // Ownership check
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(
      and(eq(products.id, productId), eq(products.adminUserId, session.user.id))
    )
    .limit(1);

  if (!product) return;

  await Promise.all(
    orderedIds.map((imgId, index) =>
      db
        .update(productImages)
        .set({ position: index })
        .where(
          and(
            eq(productImages.id, imgId),
            eq(productImages.productId, productId)
          )
        )
    )
  );

  revalidatePath(`/dashboard/products/${productId}`);
  revalidatePath(`/dashboard/products/${productId}/edit`);
}
