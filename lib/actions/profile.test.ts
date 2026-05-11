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

describe("lib/actions/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("upsertProfile", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { upsertProfile } = await import("./profile");
      await expect(upsertProfile(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects to dashboard when role is admin", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { upsertProfile } = await import("./profile");
      await expect(upsertProfile(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard"
      );
    });

    it("returns validation error when firstName is missing", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { upsertProfile } = await import("./profile");
      const fd = new FormData();
      fd.set("lastName", "Novák");
      const result = await upsertProfile(null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("returns validation error when lastName is missing", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { upsertProfile } = await import("./profile");
      const fd = new FormData();
      fd.set("firstName", "Jan");
      const result = await upsertProfile(null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("upserts profile and returns success", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      mockDbUpsert.mockResolvedValueOnce(undefined);
      const { upsertProfile } = await import("./profile");

      const fd = new FormData();
      fd.set("firstName", "Jan");
      fd.set("lastName", "Novák");

      const result = await upsertProfile(null, fd);
      expect(result).toMatchObject({ success: true });
      expect(mockDbUpsert).toHaveBeenCalledOnce();
      expect(mockRevalidatePath).toHaveBeenCalledWith("/account/profile");
    });

    it("returns error on db failure", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      mockDbUpsert.mockRejectedValueOnce(new Error("DB error"));
      const { upsertProfile } = await import("./profile");

      const fd = new FormData();
      fd.set("firstName", "Jan");
      fd.set("lastName", "Novák");

      const result = await upsertProfile(null, fd);
      expect(result).toMatchObject({ success: false });
    });
  });
});
