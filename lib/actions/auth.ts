"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email a heslo jsou povinné" };

  const { error, data } = await auth.signIn.email({ email, password });

  if (error) return { error: error.message || "Přihlášení selhalo" };

  const role = (data?.user as { role?: string } | undefined)?.role;
  redirect(role === USER_ROLES.ADMIN ? "/dashboard" : "/account");
}

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!email || !name || !password)
    return { error: "Všechna pole jsou povinná" };

  const { error } = await auth.signUp.email({
    email,
    name,
    password,
    callbackURL: "/account",
  });

  if (error) return { error: error.message || "Registrace selhala" };

  redirect("/auth/verify-email");
}

export async function signOut() {
  await auth.signOut();
  redirect("/auth/login");
}
