import { describe, it, expect, vi, beforeEach } from "vitest";

const mockQuery = vi.fn().mockResolvedValue([]);

// Thenable query builder — every chain ultimately resolves via mockQuery()
function qb(): ReturnType<typeof makeQb> {
  return makeQb();
}
function makeQb() {
  const obj = {
    then(
      onFulfilled?: (v: unknown) => unknown,
      onRejected?: (e: unknown) => unknown
    ) {
      return mockQuery().then(onFulfilled, onRejected);
    },
    from: () => qb(),
    where: () => qb(),
    orderBy: () => qb(),
    limit: () => qb(),
    groupBy: () => qb(),
    leftJoin: () => qb(),
    innerJoin: () => qb(),
  };
  return obj;
}

vi.mock("@/lib/db", () => ({
  db: { select: () => qb() },
}));

describe("lib/queries/stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockResolvedValue([]);
  });

  describe("getDashboardStats", () => {
    it("returns zero values when db is empty", async () => {
      // mockQuery returns [] by default → all counts/totals are 0
      const { getDashboardStats } = await import("./stats");
      const result = await getDashboardStats("admin-1");

      expect(result.totalRevenue).toBe(0);
      expect(result.totalOrders).toBe(0);
      expect(result.totalCustomers).toBe(0);
      expect(result.totalProducts).toBe(0);
      expect(result.lowStockProducts).toEqual([]);
      expect(result.revenueByMonth).toEqual([]);
      expect(result.ordersByStatus).toEqual([]);
    });

    it("parses revenue and counts from db rows", async () => {
      // 7 queries in Promise.all, called in array order
      mockQuery
        .mockResolvedValueOnce([{ total: "12345.67" }]) // revenue
        .mockResolvedValueOnce([{ value: 10 }])          // orders
        .mockResolvedValueOnce([{ value: 3 }])           // customers
        .mockResolvedValueOnce([{ value: 8 }])           // products
        .mockResolvedValueOnce([])                        // low stock
        .mockResolvedValueOnce([])                        // revenue by month
        .mockResolvedValueOnce([]);                       // orders by status

      const { getDashboardStats } = await import("./stats");
      const result = await getDashboardStats("admin-1");

      expect(result.totalRevenue).toBe(12345.67);
      expect(result.totalOrders).toBe(10);
      expect(result.totalCustomers).toBe(3);
      expect(result.totalProducts).toBe(8);
    });

    it("maps revenueByMonth to numeric revenue", async () => {
      mockQuery
        .mockResolvedValueOnce([{ total: "0" }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { month: "2026-01", revenue: "5000.00" },
          { month: "2026-02", revenue: "8500.50" },
        ])
        .mockResolvedValueOnce([]);

      const { getDashboardStats } = await import("./stats");
      const result = await getDashboardStats("admin-1");

      expect(result.revenueByMonth).toEqual([
        { month: "2026-01", revenue: 5000 },
        { month: "2026-02", revenue: 8500.5 },
      ]);
    });

    it("maps ordersByStatus correctly", async () => {
      mockQuery
        .mockResolvedValueOnce([{ total: "0" }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { status: "draft", count: 3 },
          { status: "confirmed", count: 5 },
        ]);

      const { getDashboardStats } = await import("./stats");
      const result = await getDashboardStats("admin-1");

      expect(result.ordersByStatus).toEqual([
        { status: "draft", count: 3 },
        { status: "confirmed", count: 5 },
      ]);
    });

    it("includes low stock products", async () => {
      const lowStockItem = {
        id: "prod-1",
        name: "Bavlněná látka",
        stock: 2,
        sku: "BAVL-001",
      };

      mockQuery
        .mockResolvedValueOnce([{ total: "0" }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([{ value: 0 }])
        .mockResolvedValueOnce([lowStockItem])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const { getDashboardStats } = await import("./stats");
      const result = await getDashboardStats("admin-1");

      expect(result.lowStockProducts).toEqual([lowStockItem]);
    });
  });
});
