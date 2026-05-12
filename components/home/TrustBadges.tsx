import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const BADGES = [
  {
    icon: Truck,
    title: "Doprava zdarma",
    desc: "Na objednávky nad 2 000 Kč",
  },
  {
    icon: ShieldCheck,
    title: "Bezpečná platba",
    desc: "100% zabezpečená transakce",
  },
  {
    icon: RefreshCw,
    title: "Vrácení do 7 dní",
    desc: "Bez zbytečných otázek",
  },
  {
    icon: Headphones,
    title: "Podpora 24/7",
    desc: "Pro velkoobchodní odběratele",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-white border-t border-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x divide-gray-100">
          {BADGES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center px-6 py-6 md:py-0">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <p className="font-semibold text-dark text-sm">{title}</p>
              <p className="text-xs text-[#6B7280] mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
