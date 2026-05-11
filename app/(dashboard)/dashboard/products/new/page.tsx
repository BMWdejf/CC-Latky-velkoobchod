import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { ProductForm } from "@/components/forms/product-form";
import { createProduct } from "@/lib/actions/products";

export const metadata = { title: "Nový produkt" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Nový produkt</h1>
      <ProductForm action={createProduct} submitLabel="Vytvořit produkt" />
    </div>
  );
}
