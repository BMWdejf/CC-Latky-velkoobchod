"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/mock-data";

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border transition-shadow hover:shadow-md">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            NOVÉ
          </span>
        )}
        {product.isSale && (
          <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white">
            SLEVA
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        aria-label="Přidat do oblíbených"
        onClick={() => setLiked((v) => !v)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        {/* Quick add on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-primary py-2.5 text-center text-sm font-semibold text-white transition-transform duration-200 group-hover:translate-y-0">
          Přidat do košíku
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <p className="line-clamp-2 text-sm font-medium text-foreground">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.round(product.rating)
                  ? "fill-[#f9a000] text-[#f9a000]"
                  : "text-border"
              }`}
            />
          ))}
          <span className="text-[11px] text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-foreground">
            {product.salePrice ?? product.price} Kč/m
          </span>
          {product.salePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.price} Kč
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
