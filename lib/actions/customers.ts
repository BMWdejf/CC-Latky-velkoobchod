"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { customerSchema, customerUpdateSchema } from "@/lib/validations/customers";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult } from "@/types";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

function normalizeEmail(values: Record<string, unknown>) {
  // Empty string email → undefined (schema accepts "" via .or(z.literal("")))
  if (values.email === "") return { ...values, email: undefined };
  return values;
}

export async function createCustomer(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const raw = normalizeEmail(Object.fromEntries(formData));
  const validated = customerSchema.safeParse(raw);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    await db.insert(customers).values({
      ...validated.data,
      adminUserId: session.user.id,
    });
  } catch (err) {
    console.error("[createCustomer]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      return {
        success: false,
        error: { userId: ["Tento zákaznický účet je již přiřazen"] },
      };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const raw = normalizeEmail(Object.fromEntries(formData));
  const validated = customerUpdateSchema.safeParse(raw);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const result = await db
      .update(customers)
      .set(validated.data)
      .where(
        and(eq(customers.id, id), eq(customers.adminUserId, session.user.id))
      );

    if (result.rowCount === 0) {
      return { success: false, error: "Zákazník nenalezen" };
    }
  } catch (err) {
    console.error("[updateCustomer]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      return {
        success: false,
        error: { userId: ["Tento zákaznický účet je již přiřazen"] },
      };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string): Promise<void> {
  const session = await requireAdmin();

  await db
    .delete(customers)
    .where(
      and(eq(customers.id, id), eq(customers.adminUserId, session.user.id))
    );

  revalidatePath("/dashboard/customers");
}
