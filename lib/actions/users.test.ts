import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.fn();
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const mockRevalidatePath = vi.fn();
const mockSql = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: { getSession: mockGetSession },
}));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@neondatabase/serverless", () => ({
  neon: () => mockSql,
}));

const adminSession = { user: { id: "admin-1", role: "admin" } };
const customerSession = { user: { id: "user-1", role: "customer" } };

describe("lib/actions/users", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("updateUserRole", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { updateUserRole } = await import("./users");
      await expect(updateUserRole("user-1", "customer")).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to account when role is customer", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { updateUserRole } = await import("./users");
      await expect(updateUserRole("user-1", "admin")).rejects.toThrow(
        "NEXT_REDIRECT:/account"
      );
    });

    it("returns error for invalid role", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { updateUserRole } = await import("./users");
      const result = await updateUserRole("user-1", "superuser");
      expect(result).toEqual({ success: false, error: "Neplatná role" });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("updates role and revalidates on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockSql.mockResolvedValueOnce([]);
      const { updateUserRole } = await import("./users");
      const result = await updateUserRole("user-1", "customer");
      expect(result).toEqual({ success: true });
      expect(mockSql).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/customers");
    });

    it("accepts all valid USER_ROLES values", async () => {
      for (const role of ["admin", "customer", "user"]) {
        mockGetSession.mockResolvedValueOnce({ data: adminSession });
        mockSql.mockResolvedValueOnce([]);
        const { updateUserRole } = await import("./users");
        const result = await updateUserRole("user-x", role);
        expect(result).toEqual({ success: true });
      }
    });
  });
});
