import Link from "next/link";
import { Star } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Stars */}
        <div className="mb-4 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-white text-white" />
          ))}
        </div>

        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Přes 1 000 spokojených firem
        </h2>
        <p className="mt-4 text-base text-white/80">
          Dodáváme kvalitní textil maloobchodním i velkoobchodním odběratelům
          po celé České republice a Evropě.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/register"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Registrovat se zdarma
          </Link>
          <Link
            href="/o-nas"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 px-8 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Zjistit více
          </Link>
        </div>
      </div>
    </section>
  );
}
