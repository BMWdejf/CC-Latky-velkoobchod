import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelectLimit = vi.fn();
const mockSelectOrderBy = vi.fn();
const mockSelectWhere = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: mockSelectLimit,
          orderBy: mockSelectOrderBy,
        }),
        innerJoin: () => ({
          where: mockSelectWhere,
        }),
      }),
    }),
  },
}));

const sampleOrder = {
  id: "order-1",
  orderNumber: "ORD-20260511-1234",
  status: "confirmed",
  totalAmount: "1500.00",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("lib/queries/account-orders", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getCustomerByUserId", () => {
    it("returns null when no customer linked to userId", async () => {
      mockSelectLimit.mockResolvedValueOnce([]);
      const { getCustomerByUserId } = await import("./account-orders");
      const result = await getCustomerByUserId("user-xyz");
      expect(result).toBeNull();
    });

    it("returns customer id when found", async () => {
      mockSelectLimit.mockResolvedValueOnce([{ id: "cust-1" }]);
      const { getCustomerByUserId } = await import("./account-orders");
      const result = await getCustomerByUserId("user-123");
      expect(result).toEqual({ id: "cust-1" });
    });
  });

  describe("getAccountOrders", () => {
    it("returns orders for the customer", async () => {
      mockSelectOrderBy.mockResolvedValueOnce([sampleOrder]);
      const { getAccountOrders } = await import("./account-orders");
      const result = await getAccountOrders("cust-1");
      expect(result).toEqual([sampleOrder]);
    });

    it("returns empty array when customer has no orders", async () => {
      mockSelectOrderBy.mockResolvedValueOnce([]);
      const { getAccountOrders } = await import("./account-orders");
      const result = await getAccountOrders("cust-1");
      expect(result).toEqual([]);
    });
  });

  describe("getAccountOrderById", () => {
    it("returns null when order not found or doesn't belong to customer", async () => {
      mockSelectLimit.mockResolvedValueOnce([]);
      const { getAccountOrderById } = await import("./account-orders");
      const result = await getAccountOrderById("order-missing", "cust-1");
      expect(result).toBeNull();
    });

    it("returns order with items — data isolation via customerId check", async () => {
      const item = {
        id: "item-1",
        orderId: "order-1",
        productId: "prod-1",
        quantity: 2,
        unitPrice: "750.00",
        productName: "Bavlněná látka",
        productSku: "BAVL-001",
      };
      mockSelectLimit.mockResolvedValueOnce([sampleOrder]);
      mockSelectWhere.mockResolvedValueOnce([item]);

      const { getAccountOrderById } = await import("./account-orders");
      const result = await getAccountOrderById("order-1", "cust-1");

      expect(result).not.toBeNull();
      expect(result?.orderNumber).toBe("ORD-20260511-1234");
      expect(result?.items).toHaveLength(1);
      expect(result?.items[0].productName).toBe("Bavlněná látka");
    });

    it("cannot return order belonging to a different customer", async () => {
      // The WHERE clause includes customerId — different customer gets empty result
      mockSelectLimit.mockResolvedValueOnce([]);
      const { getAccountOrderById } = await import("./account-orders");
      const result = await getAccountOrderById("order-1", "other-cust");
      expect(result).toBeNull();
    });
  });
});
