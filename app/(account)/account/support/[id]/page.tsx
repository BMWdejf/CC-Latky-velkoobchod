import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getCustomerByUserId } from "@/lib/queries/account-orders";
import { getCustomerTicketById } from "@/lib/queries/tickets";
import { addMessage } from "@/lib/actions/tickets";
import { TicketThread } from "@/components/shared/ticket-thread";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Detail tiketu" };
}

const STATUS_LABELS: Record<string, string> = {
  open: "Otevřen",
  in_progress: "Zpracovává se",
  resolved: "Vyřešen",
  closed: "Uzavřen",
};

export default async function AccountTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role === USER_ROLES.ADMIN) redirect("/dashboard");

  const customer = await getCustomerByUserId(session.user.id);
  if (!customer) notFound();

  const ticket = await getCustomerTicketById(id, customer.id);
  if (!ticket) notFound();

  const isClosed = ticket.status === "closed" || ticket.status === "resolved";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {STATUS_LABELS[ticket.status] ?? ticket.status} ·{" "}
            {ticket.createdAt.toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <Link
          href="/account/support"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <TicketThread
          ticketId={ticket.id}
          messages={ticket.messages}
          currentUserId={session.user.id}
          addMessageAction={addMessage}
          isClosed={isClosed}
        />
      </div>
    </div>
  );
}
