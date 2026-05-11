import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.fn();
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const mockRevalidatePath = vi.fn();
const mockDbInsertValues = vi.fn();
const mockDbUpdate = vi.fn();
const mockDbDelete = vi.fn();
const mockDbSelectLimit = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: { getSession: mockGetSession },
}));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@/lib/db", () => ({
  db: {
    insert: () => ({ values: mockDbInsertValues }),
    update: () => ({ set: () => ({ where: mockDbUpdate }) }),
    delete: () => ({ where: mockDbDelete }),
    select: () => ({
      from: () => ({
        where: () => ({ limit: mockDbSelectLimit }),
        leftJoin: () => ({
          where: () => ({
            limit: mockDbSelectLimit,
          }),
        }),
        innerJoin: () => ({ where: mockDbSelectLimit }),
      }),
    }),
  },
}));

const adminSession = { user: { id: "admin-1", role: "admin" } };
const customerSession = { user: { id: "user-1", role: "customer" } };

describe("lib/actions/orders", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── createOrder ────────────────────────────────────────────────
  describe("createOrder", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { createOrder } = await import("./orders");
      await expect(createOrder(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to account when role is customer", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { createOrder } = await import("./orders");
      await expect(createOrder(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });

    it("returns validation error when customerId is missing", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { createOrder } = await import("./orders");
      const result = await createOrder(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("returns validation error when customerId is not a UUID", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { createOrder } = await import("./orders");
      const fd = new FormData();
      fd.set("customerId", "not-a-uuid");
      const result = await createOrder(null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("creates order and redirects to order detail on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsertValues.mockResolvedValueOnce(undefined);
      const { createOrder } = await import("./orders");

      const fd = new FormData();
      fd.set("customerId", "550e8400-e29b-41d4-a716-446655440000");
      fd.set("notes", "Testovací objednávka");

      await expect(createOrder(null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/orders/"
      );
      expect(mockDbInsertValues).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/orders");
    });

    it("returns error on server exception", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsertValues.mockRejectedValueOnce(new Error("DB error"));
      const { createOrder } = await import("./orders");

      const fd = new FormData();
      fd.set("customerId", "550e8400-e29b-41d4-a716-446655440000");

      const result = await createOrder(null, fd);
      expect(result).toMatchObject({ success: false });
    });
  });

  // ── updateOrderStatus ──────────────────────────────────────────
  describe("updateOrderStatus", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { updateOrderStatus } = await import("./orders");
      await expect(
        updateOrderStatus("order-1", null, new FormData())
      ).rejects.toThrow("NEXT_REDIRECT:/auth/login");
    });

    it("returns validation error for invalid status", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { updateOrderStatus } = await import("./orders");
      const fd = new FormData();
      fd.set("status", "invalid_status");
      const result = await updateOrderStatus("order-1", null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("updates status and returns success", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbUpdate.mockResolvedValueOnce({ rowCount: 1 });
      const { updateOrderStatus } = await import("./orders");

      const fd = new FormData();
      fd.set("status", "confirmed");

      const result = await updateOrderStatus("order-1", null, fd);
      expect(result).toMatchObject({ success: true });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/orders/order-1");
    });

    it("returns error when order not found", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbUpdate.mockResolvedValueOnce({ rowCount: 0 });
      const { updateOrderStatus } = await import("./orders");

      const fd = new FormData();
      fd.set("status", "confirmed");

      const result = await updateOrderStatus("missing", null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("accepts all valid status values", async () => {
      const statuses = [
        "draft",
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ] as const;

      for (const status of statuses) {
        mockGetSession.mockResolvedValueOnce({ data: adminSession });
        mockDbUpdate.mockResolvedValueOnce({ rowCount: 1 });
        const { updateOrderStatus } = await import("./orders");

        const fd = new FormData();
        fd.set("status", status);

        const result = await updateOrderStatus("order-1", null, fd);
        expect(result).toMatchObject({ success: true });
      }
    });
  });

  // ── addOrderItem ───────────────────────────────────────────────
  describe("addOrderItem", () => {
    const validProductId = "660e8400-e29b-41d4-a716-446655440001";
    const validOrderId = "770e8400-e29b-41d4-a716-446655440002";

    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { addOrderItem } = await import("./orders");
      await expect(addOrderItem(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("returns validation error for missing fields", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { addOrderItem } = await import("./orders");
      const result = await addOrderItem(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("returns error when order not found", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit.mockResolvedValueOnce([]); // order not found
      const { addOrderItem } = await import("./orders");

      const fd = new FormData();
      fd.set("orderId", validOrderId);
      fd.set("productId", validProductId);
      fd.set("quantity", "2");

      const result = await addOrderItem(null, fd);
      expect(result).toMatchObject({ success: false, error: "Objednávka nenalezena" });
    });

    it("returns error when product not found", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit
        .mockResolvedValueOnce([{ id: validOrderId }]) // order found
        .mockResolvedValueOnce([]);                    // product not found
      const { addOrderItem } = await import("./orders");

      const fd = new FormData();
      fd.set("orderId", validOrderId);
      fd.set("productId", validProductId);
      fd.set("quantity", "2");

      const result = await addOrderItem(null, fd);
      expect(result).toMatchObject({ success: false, error: "Produkt nenalezen" });
    });

    it("adds item and returns success", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit
        .mockResolvedValueOnce([{ id: validOrderId }])      // order found
        .mockResolvedValueOnce([{ price: "150.00" }]);       // product found
      mockDbInsertValues.mockResolvedValueOnce(undefined);   // insert item
      mockDbUpdate.mockResolvedValueOnce(undefined);         // recalcTotal

      const { addOrderItem } = await import("./orders");

      const fd = new FormData();
      fd.set("orderId", validOrderId);
      fd.set("productId", validProductId);
      fd.set("quantity", "3");

      const result = await addOrderItem(null, fd);
      expect(result).toMatchObject({ success: true });
      expect(mockDbInsertValues).toHaveBeenCalledOnce();
    });
  });

  // ── removeOrderItem ────────────────────────────────────────────
  describe("removeOrderItem", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { removeOrderItem } = await import("./orders");
      await expect(removeOrderItem("order-1", "item-1")).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("does nothing when order not found", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit.mockResolvedValueOnce([]); // order not found
      const { removeOrderItem } = await import("./orders");

      await removeOrderItem("missing-order", "item-1");

      expect(mockDbDelete).not.toHaveBeenCalled();
    });

    it("removes item and recalculates total", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit.mockResolvedValueOnce([{ id: "order-1" }]); // order found
      mockDbDelete.mockResolvedValueOnce(undefined);
      mockDbUpdate.mockResolvedValueOnce(undefined); // recalcTotal

      const { removeOrderItem } = await import("./orders");

      await removeOrderItem("order-1", "item-1");

      expect(mockDbDelete).toHaveBeenCalledOnce();
      expect(mockDbUpdate).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/orders/order-1");
    });
  });
});
