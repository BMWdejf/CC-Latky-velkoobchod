import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Produkty", icon: Package },
  { href: "/dashboard/orders", label: "Objednávky", icon: ShoppingCart },
  { href: "/dashboard/customers", label: "Zákazníci", icon: Users },
  { href: "/dashboard/support", label: "Podpora", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Nastavení", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Logo / název */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <span className="text-lg font-semibold text-sidebar-foreground">
          Velkoobchod
        </span>
      </div>

      {/* Navigace */}
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
