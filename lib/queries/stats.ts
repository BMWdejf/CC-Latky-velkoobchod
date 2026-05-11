import { db } from "@/lib/db";
import { orders, customers, products } from "@/lib/db/schema";
import { eq, and, asc, lte, gte, sql, count } from "drizzle-orm";

export type LowStockProduct = {
  id: string;
  name: string;
  stock: number;
  sku: string | null;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type StatusCount = {
  status: string;
  count: number;
};

export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: LowStockProduct[];
  revenueByMonth: RevenuePoint[];
  ordersByStatus: StatusCount[];
};

const REVENUE_STATUSES = sql`('confirmed', 'shipped', 'delivered')`;

export async function getDashboardStats(
  adminUserId: string
): Promise<DashboardStats> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    revenueResult,
    ordersCountResult,
    customersCountResult,
    productsCountResult,
    lowStockResult,
    revenueByMonthResult,
    ordersByStatusResult,
  ] = await Promise.all([
    // Total revenue from completed orders
    db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.totalAmount}::numeric), 0)::text`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.adminUserId, adminUserId),
          sql`${orders.status} IN ${REVENUE_STATUSES}`
        )
      ),

    // Total orders
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.adminUserId, adminUserId)),

    // Total customers
    db
      .select({ value: count() })
      .from(customers)
      .where(eq(customers.adminUserId, adminUserId)),

    // Total products
    db
      .select({ value: count() })
      .from(products)
      .where(eq(products.adminUserId, adminUserId)),

    // Low stock products (stock <= 5)
    db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
        sku: products.sku,
      })
      .from(products)
      .where(
        and(eq(products.adminUserId, adminUserId), lte(products.stock, 5))
      )
      .orderBy(asc(products.stock))
      .limit(10),

    // Revenue grouped by month (last 6 months)
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'YYYY-MM')`,
        revenue: sql<string>`COALESCE(SUM(${orders.totalAmount}::numeric), 0)::text`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.adminUserId, adminUserId),
          sql`${orders.status} IN ${REVENUE_STATUSES}`,
          gte(orders.createdAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`date_trunc('month', ${orders.createdAt})`)
      .orderBy(sql`date_trunc('month', ${orders.createdAt})`),

    // Orders grouped by status
    db
      .select({ status: orders.status, count: count() })
      .from(orders)
      .where(eq(orders.adminUserId, adminUserId))
      .groupBy(orders.status),
  ]);

  return {
    totalRevenue: Number(revenueResult[0]?.total ?? 0),
    totalOrders: Number(ordersCountResult[0]?.value ?? 0),
    totalCustomers: Number(customersCountResult[0]?.value ?? 0),
    totalProducts: Number(productsCountResult[0]?.value ?? 0),
    lowStockProducts: lowStockResult,
    revenueByMonth: revenueByMonthResult.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
    })),
    ordersByStatus: ordersByStatusResult.map((r) => ({
      status: r.status,
      count: Number(r.count),
    })),
  };
}
