import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.fn();
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const mockRevalidatePath = vi.fn();
const mockDbUpsert = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: { getSession: mockGetSession },
}));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@/lib/db", () => ({
  db: {
    insert: () => ({
      values: () => ({
        onConflictDoUpdate: mockDbUpsert,
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  },
}));

const customerSession = { user: { id: "user-1", role: "customer" } };
const adminSession = { user: { id: "admin-1", role: "admin" } };

describe("lib/actions/company-details", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("upsertCompanyDetails", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { upsertCompanyDetails } = await import("./company-details");
      await expect(upsertCompanyDetails(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to dashboard when role is admin", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { upsertCompanyDetails } = await import("./company-details");
      await expect(upsertCompanyDetails(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard"
      );
    });

    it("upserts with valid data and returns success", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      mockDbUpsert.mockResolvedValueOnce(undefined);
      const { upsertCompanyDetails } = await import("./company-details");

      const fd = new FormData();
      fd.set("companyName", "Textil s.r.o.");
      fd.set("ico", "12345678");
      fd.set("invoiceCity", "Praha");

      const result = await upsertCompanyDetails(null, fd);
      expect(result).toMatchObject({ success: true });
      expect(mockDbUpsert).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/account/profile");
    });

    it("upserts successfully with empty form (all optional fields)", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      mockDbUpsert.mockResolvedValueOnce(undefined);
      const { upsertCompanyDetails } = await import("./company-details");

      const result = await upsertCompanyDetails(null, new FormData());
      expect(result).toMatchObject({ success: true });
    });

    it("returns error on db failure", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      mockDbUpsert.mockRejectedValueOnce(new Error("DB error"));
      const { upsertCompanyDetails } = await import("./company-details");

      const result = await upsertCompanyDetails(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });
  });
});
