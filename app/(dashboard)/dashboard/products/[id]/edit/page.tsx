import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getProductById } from "@/lib/queries/products";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/forms/product-form";

export const metadata = { title: "Upravit produkt" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const product = await getProductById(id, session.user.id);
  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Upravit produkt</h1>
      <ProductForm
        action={updateProductWithId}
        product={product}
        submitLabel="Uložit změny"
      />
    </div>
  );
}
