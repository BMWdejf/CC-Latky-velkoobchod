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
  products: { adminUserId: "adminUserId", id: "id", createdAt: "createdAt" },
  productImages: { productId: "productId", position: "position" },
  categories: { id: "id" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col, val) => `${String(col)}=${val}`),
  and: vi.fn((...args) => args.join(" AND ")),
  desc: vi.fn((col) => `${String(col)} DESC`),
  asc: vi.fn((col) => `${String(col)} ASC`),
}));

describe("lib/queries/products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("returns products for adminUserId", async () => {
      const mockData = [
        { id: "1", name: "Látka A", adminUserId: "admin-1" },
        { id: "2", name: "Látka B", adminUserId: "admin-1" },
      ];
      mockSelect.mockResolvedValueOnce(mockData);

      const { getProducts } = await import("./products");
      const result = await getProducts("admin-1");

      expect(result).toEqual(mockData);
      expect(mockSelect).toHaveBeenCalledOnce();
    });

    it("returns empty array when no products", async () => {
      mockSelect.mockResolvedValueOnce([]);

      const { getProducts } = await import("./products");
      const result = await getProducts("admin-no-products");

      expect(result).toEqual([]);
    });
  });

  describe("getProductById", () => {
    it("returns product when found", async () => {
      const mockProduct = { id: "prod-1", name: "Látka", adminUserId: "admin-1" };
      const mockImages = [{ id: "img-1", productId: "prod-1", url: "http://x.com/a.jpg", position: 0 }];
      mockSelect.mockResolvedValueOnce([mockProduct]);
      mockSelect.mockResolvedValueOnce(mockImages);

      const { getProductById } = await import("./products");
      const result = await getProductById("prod-1", "admin-1");

      expect(result).toEqual({ ...mockProduct, images: mockImages });
    });

    it("returns null when not found", async () => {
      mockSelect.mockResolvedValueOnce([]);

      const { getProductById } = await import("./products");
      const result = await getProductById("missing", "admin-1");

      expect(result).toBeNull();
    });
  });
});
