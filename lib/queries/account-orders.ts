import { db } from "@/lib/db";
import { orders, orderItems, customers, products } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type AccountOrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountOrderItemRow = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  productName: string;
  productSku: string | null;
};

export type AccountOrderDetail = AccountOrderRow & {
  items: AccountOrderItemRow[];
};

/**
 * Finds the customers record linked to this NeonAuth user.
 * Returns null if the customer doesn't have a linked account yet.
 */
export async function getCustomerByUserId(
  userId: string
): Promise<{ id: string } | null> {
  const [customer] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.userId, userId))
    .limit(1);

  return customer ?? null;
}

/**
 * Returns orders belonging to this customer, newest first.
 * ISOLATION: filtered strictly by customerId derived from the session user's userId.
 */
export async function getAccountOrders(
  customerId: string
): Promise<AccountOrderRow[]> {
  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalAmount: orders.totalAmount,
      notes: orders.notes,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

/**
 * Returns a single order with items — only if it belongs to this customer.
 * ISOLATION: double-checks customerId ownership.
 */
export async function getAccountOrderById(
  orderId: string,
  customerId: string
): Promise<AccountOrderDetail | null> {
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalAmount: orders.totalAmount,
      notes: orders.notes,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.customerId, customerId)))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      productName: products.name,
      productSku: products.sku,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}
