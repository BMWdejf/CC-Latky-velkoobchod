import Image from "next/image";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { HERO_PRODUCTS } from "@/lib/mock-data";

const PERKS = [
  { icon: Truck, label: "Doprava zdarma", sub: "nad 2 000 Kč" },
  { icon: RotateCcw, label: "Snadné vrácení", sub: "do 30 dnů" },
  { icon: ShieldCheck, label: "Bezpečná platba", sub: "SSL šifrování" },
  { icon: Headphones, label: "Podpora 24/7", sub: "pro velkoobchod" },
];

export function HeroBanner() {
  return (
    <section className="bg-background">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 py-16 lg:flex-row lg:py-24">
          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Nová kolekce 2024
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Prémiové látky
              <br />
              <span className="text-primary">pro váš byznys</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">
              Velkoobchodní dodávky kvalitních textilních materiálů. Bavlna,
              hedvábí, viskóza a stovky dalších tkanin za nejlepší ceny.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <Link
                href="/katalog"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Prohlédnout katalog
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Registrovat firmu
              </Link>
            </div>
          </div>

          {/* Right — product cards */}
          <div className="flex flex-1 justify-center gap-4">
            {HERO_PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className={`relative overflow-hidden rounded-2xl bg-muted ${
                  i === 1 ? "mt-8" : i === 2 ? "mt-16" : ""
                }`}
              >
                <Image
                  src={p.image}
                  alt={p.label}
                  width={180}
                  height={220}
                  className="object-cover"
                  priority={i === 0}
                  unoptimized
                />
                <div className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
                  {p.discount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perks bar */}
      <div className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
            {PERKS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
