"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Kolekce", href: "/katalog" },
  { label: "O nás", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-200 ${
          scrolled ? "shadow-sm bg-white/90 backdrop-blur-sm" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold text-[#111827]">Látky</span>
            <span className="text-[10px] text-[#6B7280] leading-none">látky-velkoobchod</span>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#111827] hover:text-primary transition border-b-2 border-transparent hover:border-primary pb-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons — desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-[#111827] hover:text-primary transition" aria-label="Hledat">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-[#111827] hover:text-primary transition" aria-label="Oblíbené">
              <Heart className="w-5 h-5" />
            </button>
            <button className="relative text-[#111827] hover:text-primary transition" aria-label="Košík">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                0
              </span>
            </button>
            <Link href="/auth/login" className="text-[#111827] hover:text-primary transition" aria-label="Přihlásit se">
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden text-[#111827]"
            onClick={() => setDrawerOpen(true)}
            aria-label="Otevřít menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-display font-bold text-[#111827]">Menu</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Zavřít menu">
                <X className="w-5 h-5 text-[#111827]" />
              </button>
            </div>
            <div className="flex flex-col p-4 gap-5 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#111827] hover:text-primary transition"
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 p-4 border-t border-gray-100">
              <Search className="w-5 h-5 text-[#6B7280]" />
              <Heart className="w-5 h-5 text-[#6B7280]" />
              <ShoppingCart className="w-5 h-5 text-[#6B7280]" />
              <Link href="/auth/login" onClick={() => setDrawerOpen(false)}>
                <User className="w-5 h-5 text-[#6B7280]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
