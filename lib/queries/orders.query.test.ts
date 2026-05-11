import { describe, it, expect, vi, beforeEach } from "vitest";

const mockQueryResult = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: mockQueryResult,
            limit: mockQueryResult,
          }),
        }),
        innerJoin: () => ({
          where: mockQueryResult,
        }),
        where: () => ({
          limit: mockQueryResult,
          orderBy: mockQueryResult,
        }),
      }),
    }),
  },
}));

const sampleOrder = {
  id: "order-1",
  orderNumber: "ORD-20260511-1234",
  customerId: "cust-1",
  status: "draft",
  totalAmount: "0.00",
  notes: null,
  adminUserId: "admin-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  customerName: "Testovací Textil s.r.o.",
};

describe("lib/queries/orders", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getOrders", () => {
    it("returns orders for the given admin", async () => {
      mockQueryResult.mockResolvedValueOnce([sampleOrder]);
      const { getOrders } = await import("./orders");
      const result = await getOrders("admin-1");
      expect(result).toEqual([sampleOrder]);
    });

    it("returns empty array when no orders", async () => {
      mockQueryResult.mockResolvedValueOnce([]);
      const { getOrders } = await import("./orders");
      const result = await getOrders("admin-1");
      expect(result).toEqual([]);
    });
  });

  describe("getOrderById", () => {
    it("returns null when order not found", async () => {
      mockQueryResult.mockResolvedValueOnce([]); // order query
      const { getOrderById } = await import("./orders");
      const result = await getOrderById("missing", "admin-1");
      expect(result).toBeNull();
    });

    it("returns order with items when found", async () => {
      const item = {
        id: "item-1",
        orderId: "order-1",
        productId: "prod-1",
        quantity: 2,
        unitPrice: "150.00",
        productName: "Bavlněná látka",
        productSku: "BAVL-001",
      };
      mockQueryResult
        .mockResolvedValueOnce([sampleOrder]) // order query
        .mockResolvedValueOnce([item]);        // items query

      const { getOrderById } = await import("./orders");
      const result = await getOrderById("order-1", "admin-1");

      expect(result).not.toBeNull();
      expect(result?.orderNumber).toBe("ORD-20260511-1234");
      expect(result?.items).toHaveLength(1);
      expect(result?.items[0].productName).toBe("Bavlněná látka");
    });
  });
});
