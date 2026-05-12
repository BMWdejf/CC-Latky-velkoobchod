"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/lib/actions/users";
import { USER_ROLES } from "@/lib/constants";
import type { NeonUser } from "@/lib/queries/users";

const ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: "Admin" },
  { value: USER_ROLES.CUSTOMER, label: "Zákazník" },
  { value: USER_ROLES.USER, label: "Uživatel" },
];

function UserRow({ user }: { user: NeonUser }) {
  const [selectedRole, setSelectedRole] = useState(user.role ?? USER_ROLES.USER);
  const [isPending, startTransition] = useTransition();
  const isDirty = selectedRole !== (user.role ?? USER_ROLES.USER);

  function handleSave() {
    startTransition(async () => {
      const result = await updateUserRole(user.id, selectedRole);
      if (result.success) {
        toast.success("Role byla uložena");
      } else {
        toast.error(result.error ?? "Nepodařilo se uložit roli");
      }
    });
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30">
      <td className="px-4 py-3 font-medium">{user.name ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString("cs-CZ")}
      </td>
      <td className="px-4 py-3">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          disabled={isPending}
          className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant="outline"
          disabled={!isDirty || isPending}
          onClick={handleSave}
        >
          {isPending ? "Ukládám…" : "Uložit"}
        </Button>
      </td>
    </tr>
  );
}

export function UsersTable({ users }: { users: NeonUser[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Žádní uživatelé.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Jméno
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Datum registrace
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Role
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">
              Akce
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
