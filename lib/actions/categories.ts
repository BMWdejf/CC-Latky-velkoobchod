"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { categorySchema, categoryUpdateSchema } from "@/lib/validations/categories";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult } from "@/types";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

export async function createCategory(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const validated = categorySchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    await db.insert(categories).values(validated.data);
  } catch (err) {
    console.error("[createCategory]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      return { success: false, error: { slug: ["Slug již existuje"] } };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateCategory(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const validated = categoryUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const result = await db
      .update(categories)
      .set({ ...validated.data, updatedAt: new Date() })
      .where(eq(categories.id, id));

    if (result.rowCount === 0) {
      return { success: false, error: "Kategorie nenalezena" };
    }
  } catch (err) {
    console.error("[updateCategory]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      return { success: false, error: { slug: ["Slug již existuje"] } };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/dashboard/products");
}
