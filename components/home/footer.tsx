import Link from "next/link";
import { Share2, Users, Briefcase, MessageCircle } from "lucide-react";

const FOOTER_LINKS = {
  Katalog: [
    { label: "Bavlněné látky", href: "/katalog/bavlna" },
    { label: "Hedvábí & Satén", href: "/katalog/hedvabi" },
    { label: "Viskóza & Len", href: "/katalog/viskoza" },
    { label: "Úplety", href: "/katalog/uplety" },
    { label: "Výprodej", href: "/katalog/vyprodej" },
  ],
  Pomoc: [
    { label: "Jak nakupovat", href: "/pomoc/jak-nakupovat" },
    { label: "Doprava a dodání", href: "/pomoc/doprava" },
    { label: "Vrácení zboží", href: "/pomoc/vraceni" },
    { label: "FAQ", href: "/pomoc/faq" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  Firma: [
    { label: "O nás", href: "/o-nas" },
    { label: "Velkoobchod", href: "/velkoobchod" },
    { label: "Certifikáty", href: "/certifikaty" },
    { label: "Blog", href: "/blog" },
    { label: "Kariéra", href: "/kariera" },
  ],
};

const SOCIAL = [
  { icon: Share2, label: "Instagram", href: "#" },
  { icon: Users, label: "Facebook", href: "#" },
  { icon: Briefcase, label: "LinkedIn", href: "#" },
  { icon: MessageCircle, label: "Twitter / X", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <span className="font-heading text-xl font-bold text-white">
                Latkový<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Prémiový velkoobchod textilních materiálů pro módní průmysl a
              výrobu. Dodáváme po celé Evropě.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Latkový velkoobchod s.r.o. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-4 text-sm text-white/40">
            <Link href="/soukromi" className="hover:text-white">
              Ochrana soukromí
            </Link>
            <Link href="/podminky" className="hover:text-white">
              Obchodní podmínky
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
