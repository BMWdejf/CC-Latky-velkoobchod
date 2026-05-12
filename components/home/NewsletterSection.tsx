"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-16 dot-pattern">
      <div className="max-w-xl mx-auto text-center px-4">
        <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold tracking-widest text-dark uppercase">
          Přihlásit se k novinkám
        </h2>
        <p className="text-sm text-[#6B7280] mt-2">
          Získejte 10&nbsp;% slevu na první objednávku. Zůstaňte v obraze.
        </p>

        {submitted ? (
          <p className="mt-8 text-base font-semibold text-primary">
            Děkujeme za přihlášení! Brzy se ozveme.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
            className="mt-6 flex flex-col sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Zadejte váš e-mail"
              className="flex-1 border border-gray-200 rounded-full sm:rounded-r-none px-5 py-2.5 text-sm outline-none focus:border-primary mb-2 sm:mb-0"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-full sm:rounded-l-none px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark transition"
            >
              Odebírat
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
