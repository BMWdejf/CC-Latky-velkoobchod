import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

interface AdminTopbarProps {
  userName: string;
  userEmail: string;
}

export function AdminTopbar({ userName, userEmail }: AdminTopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      {/* Levá strana — placeholder pro breadcrumb */}
      <div />

      {/* Pravá strana */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Uživatelský info */}
        <div className="flex flex-col items-end leading-tight">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>

        {/* Odhlášení */}
        <form action={signOut}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Odhlásit se">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
