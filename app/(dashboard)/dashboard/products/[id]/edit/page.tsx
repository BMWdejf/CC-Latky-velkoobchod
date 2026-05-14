import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getProductById, getCategories } from "@/lib/queries/products";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/forms/product-form";
import { ProductImageUpload } from "@/components/forms/product-image-upload";

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

  const [product, allCategories] = await Promise.all([
    getProductById(id, session.user.id),
    getCategories(),
  ]);
  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-semibold">Upravit produkt</h1>
      <ProductForm
        action={updateProductWithId}
        product={product}
        categories={allCategories}
        submitLabel="Uložit změny"
      />
      <hr className="border-border" />
      <ProductImageUpload productId={id} initialImages={product.images} />
    </div>
  );
}
