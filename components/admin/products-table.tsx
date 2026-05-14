"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/products";
import { PRODUCT_STATUS } from "@/lib/constants";
import type { Product, Category } from "@/lib/db/schema";

type ProductWithCategory = Product & { category: Category | null };

interface ProductsTableProps {
  products: (Product | ProductWithCategory)[];
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === PRODUCT_STATUS.ACTIVE;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {isActive ? "Aktivní" : "Neaktivní"}
    </span>
  );
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Žádné produkty. Přidejte první produkt.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Název</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategorie</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cena</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Sklad</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stav</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Akce</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const category = "category" in product ? product.category : null;
            return (
              <tr
                key={product.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.sku ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {Number(product.price).toLocaleString("cs-CZ", {
                    style: "currency",
                    currency: "CZK",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      product.stock === 0
                        ? "text-destructive font-medium"
                        : product.stock < 5
                          ? "text-amber-500 font-medium"
                          : ""
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Upravit</span>
                    </Link>
                    <form
                      action={deleteProduct.bind(null, product.id)}
                      onSubmit={(e) => {
                        if (!confirm(`Opravdu smazat produkt "${product.name}"?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        type="submit"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Smazat</span>
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
