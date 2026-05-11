import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.fn();
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const mockRevalidatePath = vi.fn();
const mockDbInsert = vi.fn();
const mockDbUpdate = vi.fn();
const mockDbDelete = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: { getSession: mockGetSession },
}));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@/lib/db", () => ({
  db: {
    insert: () => ({ values: mockDbInsert }),
    update: () => ({ set: () => ({ where: mockDbUpdate }) }),
    delete: () => ({ where: mockDbDelete }),
  },
}));

const adminSession = { user: { id: "admin-1", role: "admin" } };
const customerSession = { user: { id: "user-1", role: "customer" } };

describe("lib/actions/products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── createProduct ──────────────────────────────────────────────
  describe("createProduct", () => {
    it("redirects to login when not authenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { createProduct } = await import("./products");

      await expect(createProduct(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to account when role is customer", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { createProduct } = await import("./products");

      await expect(createProduct(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });

    it("returns validation error for missing required fields", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { createProduct } = await import("./products");

      const result = await createProduct(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("creates product and redirects on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockResolvedValueOnce(undefined);
      const { createProduct } = await import("./products");

      const fd = new FormData();
      fd.set("name", "Bavlněná látka");
      fd.set("price", "149.90");
      fd.set("stock", "50");

      await expect(createProduct(null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/products"
      );
      expect(mockDbInsert).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/products");
    });

    it("returns SKU error on unique constraint violation", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockRejectedValueOnce(new Error("unique constraint"));
      const { createProduct } = await import("./products");

      const fd = new FormData();
      fd.set("name", "Látka");
      fd.set("price", "100");
      fd.set("sku", "SKU-001");

      const result = await createProduct(null, fd);
      expect(result).toMatchObject({ success: false, error: { sku: expect.any(Array) } });
    });
  });

  // ── updateProduct ──────────────────────────────────────────────
  describe("updateProduct", () => {
    it("redirects to login when not authenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { updateProduct } = await import("./products");

      await expect(updateProduct("id-1", null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("updates product and redirects on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbUpdate.mockResolvedValueOnce({ rowCount: 1 });
      const { updateProduct } = await import("./products");

      const fd = new FormData();
      fd.set("name", "Nový název");
      fd.set("price", "199.00");

      await expect(updateProduct("prod-1", null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/products"
      );
      expect(mockDbUpdate).toHaveBeenCalledOnce();
    });

    it("returns error when product not found (rowCount 0)", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbUpdate.mockResolvedValueOnce({ rowCount: 0 });
      const { updateProduct } = await import("./products");

      const fd = new FormData();
      fd.set("name", "Test");
      fd.set("price", "100");

      const result = await updateProduct("missing", null, fd);
      expect(result).toMatchObject({ success: false });
    });
  });

  // ── deleteProduct ──────────────────────────────────────────────
  describe("deleteProduct", () => {
    it("redirects to login when not authenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { deleteProduct } = await import("./products");

      await expect(deleteProduct("id-1")).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("deletes product owned by admin", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbDelete.mockResolvedValueOnce(undefined);
      const { deleteProduct } = await import("./products");

      await deleteProduct("prod-1");

      expect(mockDbDelete).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/products");
    });
  });
});
