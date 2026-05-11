import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: mockSelect,
          limit: mockSelect,
        }),
      }),
    }),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  customers: { adminUserId: "adminUserId", id: "id", createdAt: "createdAt" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col, val) => `${String(col)}=${val}`),
  and: vi.fn((...args) => args.join(" AND ")),
  desc: vi.fn((col) => `${String(col)} DESC`),
}));

describe("lib/queries/customers", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getCustomers", () => {
    it("returns customers for adminUserId", async () => {
      const mockData = [
        { id: "1", companyName: "Firma A", adminUserId: "admin-1" },
        { id: "2", companyName: "Firma B", adminUserId: "admin-1" },
      ];
      mockSelect.mockResolvedValueOnce(mockData);

      const { getCustomers } = await import("./customers");
      const result = await getCustomers("admin-1");

      expect(result).toEqual(mockData);
    });

    it("returns empty array when no customers", async () => {
      mockSelect.mockResolvedValueOnce([]);
      const { getCustomers } = await import("./customers");
      expect(await getCustomers("admin-none")).toEqual([]);
    });
  });

  describe("getCustomerById", () => {
    it("returns customer when found", async () => {
      const mockCustomer = { id: "cust-1", companyName: "Firma", adminUserId: "admin-1" };
      mockSelect.mockResolvedValueOnce([mockCustomer]);
      const { getCustomerById } = await import("./customers");
      expect(await getCustomerById("cust-1", "admin-1")).toEqual(mockCustomer);
    });

    it("returns null when not found", async () => {
      mockSelect.mockResolvedValueOnce([]);
      const { getCustomerById } = await import("./customers");
      expect(await getCustomerById("missing", "admin-1")).toBeNull();
    });
  });
});
