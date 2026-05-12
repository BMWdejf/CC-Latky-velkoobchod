import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES_STRIP } from "@/lib/mock-data";

export function CategoryStrip() {
  return (
    <section className="bg-white border-y border-gray-100 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="flex gap-8 lg:gap-10 overflow-x-auto flex-1 pb-1 scrollbar-hide">
          {CATEGORIES_STRIP.map((cat) => (
            <Link
              key={cat.label}
              href="/katalog"
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
            >
              <div className="w-12 h-12 relative grayscale group-hover:grayscale-0 transition duration-200">
                <Image
                  src={cat.icon}
                  alt={cat.label}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs text-[#6B7280] group-hover:text-primary font-medium whitespace-nowrap transition">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/katalog"
          className="ml-4 shrink-0 text-[#6B7280] hover:text-primary transition"
          aria-label="Zobrazit vše"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
