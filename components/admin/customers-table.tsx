"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteCustomer } from "@/lib/actions/customers";
import type { Customer } from "@/lib/db/schema";

interface CustomersTableProps {
  customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Žádní zákazníci. Přidejte prvního zákazníka.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Firma
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Kontakt
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Email
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Telefon
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              Akce
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-border last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/dashboard/customers/${customer.id}`}
                  className="hover:underline"
                >
                  {customer.companyName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {customer.contactName ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {customer.email ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {customer.phone ?? "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Detail / upravit</span>
                  </Link>
                  <form
                    action={deleteCustomer.bind(null, customer.id)}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          `Opravdu smazat zákazníka "${customer.companyName}"?`
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      type="submit"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Smazat</span>
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
