"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  createOrderSchema,
  updateStatusSchema,
  addItemSchema,
} from "@/lib/validations/orders";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult } from "@/types";

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");
  return session;
}

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `ORD-${dateStr}-${rand}`;
}

async function recalcTotal(orderId: string): Promise<void> {
  await db
    .update(orders)
    .set({
      totalAmount: sql`(
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM order_items
        WHERE order_id = ${orderId}
      )`,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));
}

export async function createOrder(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const validated = createOrderSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const orderId = randomUUID();
  const orderNumber = generateOrderNumber();

  try {
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      ...validated.data,
      adminUserId: session.user.id,
    });
  } catch (err) {
    console.error("[createOrder]", err);
    if (err instanceof Error && err.message.includes("unique")) {
      return {
        success: false,
        error: "Číslo objednávky již existuje, zkus to znovu.",
      };
    }
    return { success: false, error: "Chyba serveru. Zkus to znovu." };
  }

  revalidatePath("/dashboard/orders");
  redirect(`/dashboard/orders/${orderId}`);
}

export async function updateOrderStatus(
  orderId: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const validated = updateStatusSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const result = await db
    .update(orders)
    .set({ status: validated.data.status, updatedAt: new Date() })
    .where(
      and(eq(orders.id, orderId), eq(orders.adminUserId, session.user.id))
    );

  if (result.rowCount === 0) {
    return { success: false, error: "Objednávka nenalezena" };
  }

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  return { success: true };
}

export async function addOrderItem(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  const validated = addItemSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const { orderId, productId, quantity } = validated.data;

  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(eq(orders.id, orderId), eq(orders.adminUserId, session.user.id))
    )
    .limit(1);

  if (!order) {
    return { success: false, error: "Objednávka nenalezena" };
  }

  const [product] = await db
    .select({ price: products.price })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) {
    return { success: false, error: "Produkt nenalezen" };
  }

  await db.insert(orderItems).values({
    orderId,
    productId,
    quantity,
    unitPrice: product.price,
  });

  await recalcTotal(orderId);

  revalidatePath(`/dashboard/orders/${orderId}`);
  return { success: true };
}

export async function removeOrderItem(
  orderId: string,
  itemId: string
): Promise<void> {
  const session = await requireAdmin();

  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(eq(orders.id, orderId), eq(orders.adminUserId, session.user.id))
    )
    .limit(1);

  if (!order) return;

  await db.delete(orderItems).where(eq(orderItems.id, itemId));
  await recalcTotal(orderId);
  revalidatePath(`/dashboard/orders/${orderId}`);
}
