import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

const DISCOUNT_CARDS = [
  { pct: 10, threshold: "2 000 Kč", dark: false },
  { pct: 20, threshold: "4 500 Kč", dark: true },
  { pct: 30, threshold: "9 000 Kč", dark: false },
];

export function HeroSection() {
  return (
    <section className="bg-[#FAFAFA] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr_2fr]">
          {/* Left — text */}
          <div className="flex flex-col justify-center py-12 lg:py-16">
            <h1 className="font-display text-[3.25rem] font-bold text-[#111827] leading-[1.1]">
              Fashion That Has
              <br />
              <span className="text-primary italic">Sense</span>
            </h1>
            <p className="text-sm text-[#6B7280] mt-3 max-w-xs leading-relaxed">
              Proměňte svůj styl s nejnovějšími kolekcemi a módními trendy
            </p>
            <Link
              href="/katalog"
              className="mt-6 w-fit bg-primary text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark transition"
            >
              Browse now
            </Link>
          </div>

          {/* Center — model image */}
          <div className="flex items-end justify-center min-h-[320px] lg:min-h-[480px]">
            <div className="relative w-full h-[320px] lg:h-[480px]">
              <Image
                src="https://placehold.co/400x480/EEF2FF/0B5FFF?text=Model"
                alt="Fashion model"
                fill
                className="object-contain"
                unoptimized
              />
              <span className="font-script text-5xl text-[#8B4513] absolute bottom-8 left-4 -rotate-6 select-none pointer-events-none">
                journey
              </span>
            </div>
          </div>

          {/* Right — discount cards */}
          <div className="flex flex-row lg:flex-col justify-center gap-3 py-8 lg:py-16 items-center">
            {DISCOUNT_CARDS.map((card) => (
              <div
                key={card.pct}
                className={`rounded-xl p-4 w-full max-w-[160px] ${
                  card.dark
                    ? "bg-navy text-white shadow-md"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                <p className={`font-bold text-lg ${card.dark ? "text-white" : "text-dark"}`}>
                  Sleva {card.pct}&nbsp;%
                </p>
                <p className={`text-xs mt-0.5 ${card.dark ? "text-blue-200" : "text-[#6B7280]"}`}>
                  Nad {card.threshold}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating chat button */}
      <button
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg z-40 hover:bg-primary-dark transition"
        aria-label="Live chat"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    </section>
  );
}
