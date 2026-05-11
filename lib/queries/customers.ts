import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { Customer } from "@/lib/db/schema";

export async function getCustomers(adminUserId: string): Promise<Customer[]> {
  return db
    .select()
    .from(customers)
    .where(eq(customers.adminUserId, adminUserId))
    .orderBy(desc(customers.createdAt));
}

export async function getCustomerById(
  id: string,
  adminUserId: string
): Promise<Customer | null> {
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.adminUserId, adminUserId)))
    .limit(1);

  return customer ?? null;
}
