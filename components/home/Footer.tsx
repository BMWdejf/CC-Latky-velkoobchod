import Link from "next/link";

const FOOTER_COLS = {
  Nakupování: [
    { label: "Bavlněné látky", href: "/katalog/bavlna" },
    { label: "Hedvábí & Satén", href: "/katalog/hedvabi" },
    { label: "Viskóza & Len", href: "/katalog/viskoza" },
    { label: "Úplety", href: "/katalog/uplety" },
    { label: "Výprodej", href: "/katalog/vyprodej" },
    { label: "Novinky", href: "/katalog/novinky" },
  ],
  "Potřebujete pomoc?": [
    { label: "Jak nakupovat", href: "/pomoc/jak-nakupovat" },
    { label: "Doprava a dodání", href: "/pomoc/doprava" },
    { label: "Vrácení zboží", href: "/pomoc/vraceni" },
    { label: "Velkoobchod", href: "/velkoobchod" },
    { label: "FAQ", href: "/pomoc/faq" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  Informace: [
    { label: "O nás", href: "/o-nas" },
    { label: "Certifikáty", href: "/certifikaty" },
    { label: "Blog", href: "/blog" },
    { label: "Kariéra", href: "/kariera" },
    { label: "Ochrana soukromí", href: "/soukromi" },
    { label: "Podmínky", href: "/podminky" },
  ],
};

const SOCIAL = ["F", "T", "I", "P", "Y"];

function SocialIcon({ letter }: { letter: string }) {
  return (
    <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-[#6B7280] hover:text-primary hover:border-primary transition cursor-pointer">
      {letter}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/">
              <span className="font-display text-xl font-bold text-dark">Látky</span>
            </Link>
            <p className="text-xs text-[#6B7280] mt-3 max-w-[180px] leading-relaxed">
              Prémiový velkoobchod textilních materiálů pro módní průmysl a výrobu.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {SOCIAL.map((l) => (
                <SocialIcon key={l} letter={l} />
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_COLS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-dark text-sm mb-4">{title}</h3>
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] hover:text-primary transition block mb-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-dark text-sm mb-4">Kontakt</h3>
            <p className="text-xs text-[#6B7280] leading-loose">
              Latkový velkoobchod s.r.o.
              <br />
              Průmyslová 123
              <br />
              110 00 Praha 1
              <br />
              +420 800 123 456
              <br />
              info@latky-velkoobchod.cz
            </p>
            <button className="border border-gray-200 rounded px-4 py-1.5 text-xs text-dark mt-3 hover:border-primary hover:text-primary transition block">
              YouTube | FAQ
            </button>
            <button className="bg-dark text-white rounded px-4 py-1.5 text-xs font-semibold mt-2 hover:bg-gray-800 transition block">
              LIVE CHAT
            </button>
          </div>
        </div>

        {/* Follow Us strip */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-dark">Follow Us:</span>
          {SOCIAL.map((l) => (
            <SocialIcon key={l} letter={l} />
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} Latkový velkoobchod s.r.o. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-3 text-sm font-medium text-[#6B7280]">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
