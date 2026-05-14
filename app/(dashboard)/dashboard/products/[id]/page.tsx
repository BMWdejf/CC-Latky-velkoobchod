import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getProductById } from "@/lib/queries/products";
import { RichTextContent } from "@/components/rich-text-content";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Detail produktu" };
}

export default async function ProductDetailPage({
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <Link
          href={`/dashboard/products/${id}/edit`}
          className={buttonVariants()}
        >
          Upravit
        </Link>
      </div>

      <dl className="divide-y divide-border rounded-lg border border-border bg-card text-sm">
        {[
          { label: "SKU", value: product.sku ?? "—" },
          {
            label: "Cena",
            value: Number(product.price).toLocaleString("cs-CZ", {
              style: "currency",
              currency: "CZK",
            }),
          },
          { label: "Sklad", value: String(product.stock) },
          {
            label: "Vytvořeno",
            value: new Date(product.createdAt).toLocaleDateString("cs-CZ"),
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex px-4 py-3">
            <dt className="w-32 shrink-0 font-medium text-muted-foreground">
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}

        {product.description && (
          <div className="px-4 py-3">
            <dt className="mb-2 font-medium text-muted-foreground">Popis</dt>
            <dd>
              <RichTextContent
                html={product.description}
                className="prose prose-sm dark:prose-invert max-w-none"
              />
            </dd>
          </div>
        )}
      </dl>

      {product.images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Obrázky ({product.images.length})</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {product.images.map((img, index) => (
              <div
                key={img.id}
                className={`relative aspect-square overflow-hidden rounded-lg border border-border bg-muted ${index === 0 ? "ring-2 ring-primary" : ""}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? "Obrázek produktu"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-primary px-1 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Hlavní
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/dashboard/products"
        className={buttonVariants({ variant: "outline" })}
      >
        ← Zpět na produkty
      </Link>
    </div>
  );
}
