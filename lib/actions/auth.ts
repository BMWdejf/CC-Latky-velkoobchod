"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

  redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`);
}

export async function signOut() {
  await auth.signOut();
  redirect("/auth/login");
}
