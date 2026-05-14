"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { productSchema, productUpdateSchema } from "@/lib/validations/products";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult } from "@/types";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

function toInsertValues(data: ReturnType<typeof productSchema.parse>) {
  return {
    ...data,
    price: String(data.price),
    compareAtPrice: data.compareAtPrice != null ? String(data.compareAtPrice) : null,
    weight: data.weight != null ? String(data.weight) : null,
    categoryId: data.categoryId ?? null,
  };
}

export async function createProduct(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const validated = productSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    await db.insert(products).values({
      ...toInsertValues(validated.data),
      adminUserId: session.user.id,
    });
  } catch (err) {
    console.error("[createProduct]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      const msg: Record<string, string[]> = err.message.includes("slug")
        ? { slug: ["Slug již existuje"] }
        : { sku: ["SKU již existuje"] };
      return { success: false, error: msg };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/katalog");
  redirect("/dashboard/products");
}

export async function updateProduct(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const validated = productUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const { price, compareAtPrice, weight, categoryId, ...rest } = validated.data;
    const updateData = {
      ...rest,
      ...(price !== undefined && { price: String(price) }),
      ...(compareAtPrice !== undefined && {
        compareAtPrice: compareAtPrice != null ? String(compareAtPrice) : null,
      }),
      ...(weight !== undefined && {
        weight: weight != null ? String(weight) : null,
      }),
      ...(categoryId !== undefined && { categoryId: categoryId ?? null }),
      updatedAt: new Date(),
    };

    const result = await db
      .update(products)
      .set(updateData)
      .where(
        and(eq(products.id, id), eq(products.adminUserId, session.user.id))
      );

    if (result.rowCount === 0) {
      return { success: false, error: "Produkt nenalezen" };
    }
  } catch (err) {
    console.error("[updateProduct]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      const msg: Record<string, string[]> = err.message.includes("slug")
        ? { slug: ["Slug již existuje"] }
        : { sku: ["SKU již existuje"] };
      return { success: false, error: msg };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}`);
  revalidatePath("/katalog");
  redirect("/dashboard/products");
}

export async function deleteProduct(id: string): Promise<void> {
  const session = await requireAdmin();

  await db
    .delete(products)
    .where(
      and(eq(products.id, id), eq(products.adminUserId, session.user.id))
    );

  revalidatePath("/dashboard/products");
  revalidatePath("/katalog");
}
