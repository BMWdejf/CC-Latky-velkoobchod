import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId } from "@/lib/queries/account-orders";
import { getCustomerTickets } from "@/lib/queries/tickets";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Podpora" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  open: "Otevřen",
  in_progress: "Zpracovává se",
  resolved: "Vyřešen",
  closed: "Uzavřen",
};

const STATUS_CLASSES: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-muted text-muted-foreground",
};

export default async function AccountSupportPage() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.CUSTOMER) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);
  const myTickets = customer ? await getCustomerTickets(customer.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Podpora</h1>
        <Link href="/account/support/new" className={buttonVariants()}>
          Nový tiket
        </Link>
      </div>

      {myTickets.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Žádné tikety. Máte dotaz?{" "}
          <Link href="/account/support/new" className="underline">
            Vytvořte tiket
          </Link>
          .
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Předmět</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stav</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Aktualizován</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Detail</th>
              </tr>
            </thead>
            <tbody>
              {myTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/account/support/${ticket.id}`} className="hover:underline">
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[ticket.status] ?? STATUS_CLASSES.open}`}>
                      {STATUS_LABELS[ticket.status] ?? ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {ticket.updatedAt.toLocaleDateString("cs-CZ")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/account/support/${ticket.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Otevřít
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
