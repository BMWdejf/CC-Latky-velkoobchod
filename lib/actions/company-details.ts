"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { companyDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { companyDetailsSchema } from "@/lib/validations/company-details";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult } from "@/types";

async function requireCustomer() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.CUSTOMER) redirect("/dashboard");
  return session;
}

export async function upsertCompanyDetails(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireCustomer();

  const validated = companyDetailsSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  // Normalize empty strings to undefined (stored as NULL in DB)
  const data = Object.fromEntries(
    Object.entries(validated.data).map(([k, v]) => [k, v === "" ? undefined : v])
  ) as typeof validated.data;

  try {
    await db
      .insert(companyDetails)
      .values({ userId: session.user.id, ...data })
      .onConflictDoUpdate({
        target: companyDetails.userId,
        set: { ...data, updatedAt: new Date() },
      });
  } catch (err) {
    console.error("[upsertCompanyDetails]", err);
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/account/profile");
  return { success: true };
}

export async function getCompanyDetails(userId: string) {
  const [detail] = await db
    .select()
    .from(companyDetails)
    .where(eq(companyDetails.userId, userId))
    .limit(1);

  return detail ?? null;
}
