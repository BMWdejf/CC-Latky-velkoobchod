"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  rating: string;
  reviewCount: number;
  image: string;
  colors: string[];
  sizes: string[];
}

export function ProductCard({
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  colors,
  sizes,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="bg-card-bg rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-[3/4]">
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 transition"
          aria-label={wishlisted ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
        >
          <Heart
            className={`w-[18px] h-[18px] transition ${
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-1">
          {colors.map((color) => (
            <span
              key={color}
              className="w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <div className="px-3 pt-3 pb-3">
        <p className="text-sm font-medium text-dark leading-tight">{name}</p>
        <p className="text-xs text-[#6B7280] mt-0.5">{brand}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-xs text-[#6B7280]">
            {rating} ({reviewCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          {originalPrice && (
            <span className="text-xs text-[#6B7280] line-through">{originalPrice} Kč</span>
          )}
          <span className="text-sm font-bold text-dark">{price} Kč</span>
        </div>
        <p className="text-[11px] text-[#6B7280] mt-1">{sizes.join(" ")}</p>
      </div>
    </div>
  );
}
