"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { TicketMessageRow } from "@/lib/queries/tickets";

type FieldErrors = Record<string, string[]>;

interface TicketThreadProps {
  ticketId: string;
  messages: TicketMessageRow[];
  currentUserId: string;
  addMessageAction: (
    prevState: unknown,
    formData: FormData
  ) => Promise<ActionResult>;
  isClosed: boolean;
}

export function TicketThread({
  ticketId,
  messages,
  currentUserId,
  addMessageAction,
  isClosed,
}: TicketThreadProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<FieldErrors> | null,
    FormData
  >(
    addMessageAction as (
      prev: ActionResult<FieldErrors> | null,
      fd: FormData
    ) => Promise<ActionResult<FieldErrors>>,
    null
  );

  const formError =
    state && !state.success && typeof state.error === "string"
      ? state.error
      : null;

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success("Zpráva odeslána");
    else if (typeof state.error === "string") toast.error(state.error);
  }, [state]);

  return (
    <div className="space-y-4">
      {/* Message thread */}
      <div className="space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Žádné zprávy.
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.authorId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm ${
                  isMine
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.body}</p>
                <p
                  className={`mt-1 text-xs ${
                    isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.createdAt.toLocaleString("cs-CZ", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply form */}
      {!isClosed ? (
        <form action={formAction} className="space-y-2 border-t border-border pt-4">
          <input type="hidden" name="ticketId" value={ticketId} />
          <textarea
            name="body"
            rows={3}
            placeholder="Napište zprávu…"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {formError && (
            <p className="text-xs text-destructive">{formError}</p>
          )}
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Odesílám…" : "Odeslat zprávu"}
          </Button>
        </form>
      ) : (
        <p className="border-t border-border pt-4 text-sm text-muted-foreground">
          Ticket je uzavřen — nelze přidávat zprávy.
        </p>
      )}
    </div>
  );
}
