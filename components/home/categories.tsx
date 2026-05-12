import Image from "next/image";
import Link from "next/link";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export function Categories() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Nakupovat podle kategorie
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vyberte z naší široké nabídky textilních materiálů
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-heading text-xl font-bold text-white">
                    {cat.label}
                  </h3>
                  <span className="mt-2 inline-flex items-center text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    Prohlédnout →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
