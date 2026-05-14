import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/queries/products";
import { RichTextContent } from "@/components/rich-text-content";
import { buttonVariants } from "@/components/ui/button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) return { title: "Produkt nenalezen" };
  return {
    title: product.name,
    description: product.description
      ? product.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : `${product.name} — prémiová látka`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Obrázky */}
        <div className="space-y-3">
          {/* Hlavní obrázek */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Image
                src={`https://placehold.co/600x800/EEF2FF/0B5FFF?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          {/* Miniatury */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-muted ${i === 0 ? "ring-2 ring-primary" : ""}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex flex-col justify-center space-y-5">
          {product.category && (
            <Link
              href={`/katalog?category=${product.category.slug}`}
              className="text-xs font-medium text-primary hover:underline uppercase tracking-wide"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="font-display text-3xl font-bold text-foreground">
            {product.name}
          </h1>

          {/* Cena */}
          <div className="flex items-center gap-3">
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {Number(product.compareAtPrice).toLocaleString("cs-CZ", {
                  style: "currency",
                  currency: "CZK",
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              {Number(product.price).toLocaleString("cs-CZ", {
                style: "currency",
                currency: "CZK",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          {/* Dostupnost */}
          <p
            className={`text-sm font-medium ${
              inStock ? "text-green-600 dark:text-green-400" : "text-destructive"
            }`}
          >
            {inStock ? `Skladem (${product.stock} ks)` : "Není skladem"}
          </p>

          {/* Popis */}
          {product.description && (
            <div className="border-t border-border pt-4">
              <RichTextContent
                html={product.description}
                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
              />
            </div>
          )}

          {/* Meta — SKU, rozměry, váha */}
          <dl className="divide-y divide-border rounded-lg border border-border text-sm">
            {product.sku && (
              <div className="flex px-4 py-2">
                <dt className="w-28 shrink-0 text-muted-foreground">SKU</dt>
                <dd>{product.sku}</dd>
              </div>
            )}
            {product.weight && (
              <div className="flex px-4 py-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Váha</dt>
                <dd>{product.weight} kg</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="flex px-4 py-2">
                <dt className="w-28 shrink-0 text-muted-foreground">Rozměry</dt>
                <dd>{product.dimensions}</dd>
              </div>
            )}
          </dl>

          <Link
            href="/katalog"
            className={buttonVariants({ variant: "outline" })}
          >
            ← Zpět na katalog
          </Link>
        </div>
      </div>
    </div>
  );
}
