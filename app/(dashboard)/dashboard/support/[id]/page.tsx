import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { getAdminTicketById } from "@/lib/queries/tickets";
import { addMessage, updateTicketStatus } from "@/lib/actions/tickets";
import { TicketThread } from "@/components/shared/ticket-thread";
import { OrderStatusSelector } from "@/components/admin/order-status-selector";
import { buttonVariants } from "@/components/ui/button";
import { TicketStatusSelector } from "@/components/admin/ticket-status-selector";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Detail tiketu" };
}

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const ticket = await getAdminTicketById(id, session.user.id);
  if (!ticket) notFound();

  const isClosed = ticket.status === "closed" || ticket.status === "resolved";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ticket.customerName ?? "Neznámý zákazník"} ·{" "}
            {ticket.createdAt.toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <Link
          href="/dashboard/support"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>

      {/* Status selector */}
      <div className="rounded-lg border border-border bg-card p-4">
        <TicketStatusSelector
          ticketId={ticket.id}
          currentStatus={ticket.status}
          updateStatusAction={updateTicketStatus}
        />
      </div>

      {/* Thread */}
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
