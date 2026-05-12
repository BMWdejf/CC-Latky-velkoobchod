"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

type Tab = "new" | "bestseller" | "sale";

const TABS: { label: string; value: Tab }[] = [
  { label: "New Arrival", value: "new" },
  { label: "Best Seller", value: "bestseller" },
  { label: "On Sell", value: "sale" },
];

export function ProductsOfTheDay() {
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const filtered = PRODUCTS.filter((p) => p.tab === activeTab).slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-display text-[2rem] font-bold text-dark leading-tight">
            Check out products of the day
          </h2>
          <p className="text-sm text-[#6B7280] mt-2">
            Nejlepší textilní materiály pro váš styl
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-1.5 text-sm rounded-full transition ${
                activeTab === tab.value
                  ? "bg-primary text-white font-semibold"
                  : "text-[#6B7280] hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Explore more */}
        <div className="flex justify-center mt-10">
          <Link
            href="/katalog"
            className="border border-primary text-primary rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition"
          >
            Prohlédnout více →
          </Link>
        </div>
      </div>
    </section>
  );
}
