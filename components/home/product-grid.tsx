import Link from "next/link";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/mock-data";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export function ProductGrid({ title, subtitle, products, viewAllHref }: ProductGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View all */}
      {viewAllHref && (
        <div className="mt-10 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-primary px-8 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Zobrazit vše
          </Link>
        </div>
      )}
    </section>
  );
}
