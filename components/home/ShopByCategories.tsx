import Image from "next/image";
import Link from "next/link";
import { SHOP_CATEGORIES } from "@/lib/mock-data";

export function ShopByCategories() {
  return (
    <section className="py-16 bg-page-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-[2rem] font-bold text-dark">
            Nakupovat podle Kategorie
          </h2>
          <p className="text-sm text-[#6B7280] mt-2">
            Vyberte z naší široké nabídky textilních materiálů
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-300 block ${cat.bgClass}`}
            >
              <div className="pt-6 px-6">
                <h3 className="font-display text-xl font-bold text-dark">{cat.label}</h3>
                <p className="text-xs text-[#6B7280] mt-1">{cat.sub}</p>
              </div>
              <div className="relative h-[220px] mt-4">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
