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

describe("lib/actions/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCategory", () => {
    it("redirects to login when not authenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { createCategory } = await import("./categories");

      await expect(createCategory(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to account when role is customer", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { createCategory } = await import("./categories");

      await expect(createCategory(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });

    it("returns validation error for missing required fields", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { createCategory } = await import("./categories");

      const result = await createCategory(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("creates category and redirects on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockResolvedValueOnce(undefined);
      const { createCategory } = await import("./categories");

      const fd = new FormData();
      fd.set("name", "Bavlněné látky");
      fd.set("slug", "bavlnene-latky");

      await expect(createCategory(null, fd)).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard/products"
      );
      expect(mockDbInsert).toHaveBeenCalledOnce();
    });

    it("returns slug error on unique constraint violation", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbInsert.mockRejectedValueOnce(new Error("unique constraint"));
      const { createCategory } = await import("./categories");

      const fd = new FormData();
      fd.set("name", "Bavlněné látky");
      fd.set("slug", "bavlnene-latky");

      const result = await createCategory(null, fd);
      expect(result).toMatchObject({
        success: false,
        error: { slug: expect.any(Array) },
      });
    });
  });

  describe("deleteCategory", () => {
    it("redirects to login when not authenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { deleteCategory } = await import("./categories");

      await expect(deleteCategory("cat-1")).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("deletes category when admin", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbDelete.mockResolvedValueOnce(undefined);
      const { deleteCategory } = await import("./categories");

      await deleteCategory("cat-1");

      expect(mockDbDelete).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/products");
    });
  });
});
