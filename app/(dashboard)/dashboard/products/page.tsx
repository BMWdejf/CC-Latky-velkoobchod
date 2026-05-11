import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getProducts } from "@/lib/queries/products";
import { ProductsTable } from "@/components/admin/products-table";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Produkty" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const allProducts = await getProducts(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produkty</h1>
        <Link href="/dashboard/products/new" className={buttonVariants()}>
          Přidat produkt
        </Link>
      </div>
      <ProductsTable products={allProducts} />
    </div>
  );
}
