import Link from "next/link";
import Image from "next/image";
import { getPublicProducts, getCategories } from "@/lib/queries/products";

export const metadata = { title: "Katalog látek" };

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [items, cats] = await Promise.all([
    getPublicProducts(category),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
        Katalog látek
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {items.length} produktů
      </p>

      {/* Kategorie filter */}
      {cats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/products"
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              !category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary"
            }`}
          >
            Vše
          </Link>
          {cats.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                category === cat.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Žádné produkty v této kategorii.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group rounded-xl overflow-hidden bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={`https://placehold.co/300x380/EEF2FF/0B5FFF?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {product.compareAtPrice && (
                  <span className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
                    Sleva
                  </span>
                )}
              </div>
              <div className="px-3 py-3">
                <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                  {product.name}
                </p>
                {product.category && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.category.name}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                  {product.compareAtPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {Number(product.compareAtPrice).toLocaleString("cs-CZ", {
                        style: "currency",
                        currency: "CZK",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  )}
                  <span className="text-sm font-bold text-foreground">
                    {Number(product.price).toLocaleString("cs-CZ", {
                      style: "currency",
                      currency: "CZK",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {product.stock > 0
                    ? `Skladem: ${product.stock}`
                    : "Není skladem"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
