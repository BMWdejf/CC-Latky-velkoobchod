import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { NewTicketForm } from "@/components/forms/new-ticket-form";

export const metadata = { title: "Nový tiket" };

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nový tiket</h1>
        <Link
          href="/account/support"
          className={buttonVariants({ variant: "outline" })}
        >
          ← Zpět
        </Link>
      </div>
      <NewTicketForm />
    </div>
  );
}
