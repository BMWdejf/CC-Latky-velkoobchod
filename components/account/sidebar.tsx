import Link from "next/link";
import { LayoutDashboard, ShoppingCart, FileText, User } from "lucide-react";

const navItems = [
  { href: "/account", label: "Přehled", icon: LayoutDashboard },
  { href: "/account/orders", label: "Objednávky", icon: ShoppingCart },
  { href: "/account/invoices", label: "Faktury", icon: FileText },
  { href: "/account/profile", label: "Profil", icon: User },
];

export function AccountSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <span className="text-lg font-semibold text-sidebar-foreground">
          Můj účet
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
