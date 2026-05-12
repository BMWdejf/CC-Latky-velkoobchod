"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";

const VALID_ROLES = Object.values(USER_ROLES) as string[];

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (!VALID_ROLES.includes(role)) {
    return { success: false, error: "Neplatná role" };
  }

  const sql = neon(process.env.DATABASE_URL!);
  await sql`UPDATE neon_auth.users SET role = ${role} WHERE id = ${userId}`;

  revalidatePath("/dashboard/customers");
  return { success: true };
}
