"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Odebírejte novinky
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Přihlaste se k odběru a jako první se dozvíte o nových kolekcích,
          slevách a velkoobchodních nabídkách.
        </p>

        {submitted ? (
          <p className="mt-8 text-base font-semibold text-primary">
            Děkujeme za přihlášení! Brzy se ozveme.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Přihlásit se
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
