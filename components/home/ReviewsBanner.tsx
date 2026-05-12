import Image from "next/image";
import Link from "next/link";

export function ReviewsBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F9FA] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 md:h-auto min-h-[280px]">
            <Image
              src="https://placehold.co/600x400/F0F4FF/0B5FFF?text=Tkaniny"
              alt="Kolekce tkanin"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center px-8 lg:px-12 py-10">
            <h2 className="font-display text-4xl font-bold text-dark leading-tight">
              Přes 1&nbsp;000
              <br />
              Pěticihvězdičkových hodnocení
            </h2>
            <p className="text-sm text-[#6B7280] mt-3 max-w-xs leading-relaxed">
              Dodáváme kvalitní textil maloobchodním i velkoobchodním odběratelům po celé České republice a Evropě.
            </p>
            <Link
              href="/katalog"
              className="mt-6 w-fit bg-primary text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark transition"
            >
              Nakupovat kolekce →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
