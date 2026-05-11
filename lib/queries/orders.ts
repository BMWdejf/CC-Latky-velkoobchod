import { db } from "@/lib/db";
import { orders, orderItems, customers, products } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type OrderRow = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  status: string;
  totalAmount: string;
  notes: string | null;
  adminUserId: string;
  createdAt: Date;
  updatedAt: Date;
  customerName: string | null;
};

export type OrderItemRow = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  productName: string;
  productSku: string | null;
};

export type OrderDetail = OrderRow & {
  items: OrderItemRow[];
};

export async function getOrders(adminUserId: string): Promise<OrderRow[]> {
  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerId: orders.customerId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      notes: orders.notes,
      adminUserId: orders.adminUserId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customerName: customers.companyName,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.adminUserId, adminUserId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(
  id: string,
  adminUserId: string
): Promise<OrderDetail | null> {
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerId: orders.customerId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      notes: orders.notes,
      adminUserId: orders.adminUserId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customerName: customers.companyName,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(eq(orders.id, id), eq(orders.adminUserId, adminUserId)))
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
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}
