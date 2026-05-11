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

describe("lib/actions/customers", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── createCustomer ────────────────────────────────────────────
  describe("createCustomer", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { createCustomer } = await import("./customers");
      await expect(createCustomer(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to account when role is customer", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { createCustomer } = await import("./customers");
      await expect(createCustomer(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });

    it("returns validation error for missing companyName", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { createCustomer } = await import("./customers");
      const result = await createCustomer(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("creates customer and redirects on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockResolvedValueOnce(undefined);
      const { createCustomer } = await import("./customers");

      const fd = new FormData();
      fd.set("companyName", "Textil s.r.o.");
      fd.set("email", "info@textil.cz");

      await expect(createCustomer(null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/customers"
      );
      expect(mockDbInsert).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/customers");
    });

    it("returns userId error on unique constraint violation", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockRejectedValueOnce(new Error("unique constraint"));
      const { createCustomer } = await import("./customers");

      const fd = new FormData();
      fd.set("companyName", "Firma");
      fd.set("userId", "existing-user-id");

      const result = await createCustomer(null, fd);
      expect(result).toMatchObject({
        success: false,
        error: { userId: expect.any(Array) },
      });
    });

    it("treats empty email string as no email", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockResolvedValueOnce(undefined);
      const { createCustomer } = await import("./customers");

      const fd = new FormData();
      fd.set("companyName", "Firma bez emailu");
      fd.set("email", "");

      await expect(createCustomer(null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/customers"
      );
    });
  });

  // ── updateCustomer ────────────────────────────────────────────
  describe("updateCustomer", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { updateCustomer } = await import("./customers");
      await expect(
        updateCustomer("id-1", null, new FormData())
      ).rejects.toThrow("NEXT_REDIRECT:/auth/login");
    });

    it("updates customer and redirects on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbUpdate.mockResolvedValueOnce({ rowCount: 1 });
      const { updateCustomer } = await import("./customers");

      const fd = new FormData();
      fd.set("companyName", "Nový název s.r.o.");

      await expect(updateCustomer("cust-1", null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/customers"
      );
    });

    it("returns error when customer not found", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbUpdate.mockResolvedValueOnce({ rowCount: 0 });
      const { updateCustomer } = await import("./customers");

      const fd = new FormData();
      fd.set("companyName", "Test");

      const result = await updateCustomer("missing", null, fd);
      expect(result).toMatchObject({ success: false });
    });
  });

  // ── deleteCustomer ────────────────────────────────────────────
  describe("deleteCustomer", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { deleteCustomer } = await import("./customers");
      await expect(deleteCustomer("id-1")).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("deletes customer owned by admin", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbDelete.mockResolvedValueOnce(undefined);
      const { deleteCustomer } = await import("./customers");

      await deleteCustomer("cust-1");

      expect(mockDbDelete).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/customers");
    });
  });
});
