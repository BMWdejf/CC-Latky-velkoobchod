"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { profileSchema } from "@/lib/validations/profile";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult } from "@/types";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

export async function upsertAdminProfile(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const validated = profileSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    await db
      .insert(profiles)
      .values({
        userId: session.user.id,
        firstName: validated.data.firstName,
        lastName: validated.data.lastName,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          firstName: validated.data.firstName,
          lastName: validated.data.lastName,
          updatedAt: new Date(),
        },
      });
  } catch (err) {
    console.error("[upsertAdminProfile]", err);
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function getAdminProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return profile ?? null;
}
