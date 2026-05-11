import { describe, it, expect, vi, beforeEach } from "vitest";
import type { InvoiceRow } from "./invoices";

vi.mock("@/lib/db", () => ({ db: { select: vi.fn() } }));

import { db } from "@/lib/db";
import { getAdminInvoices, getAdminInvoiceById } from "./invoices";

const mockInvoice: InvoiceRow = {
  id: "inv-1",
  invoiceNumber: "INV-20260511-1234",
  customerId: "cust-1",
  customerName: "ACME s.r.o.",
  orderId: null,
  status: "issued",
  totalAmount: "15000.00",
  dueDate: new Date("2026-06-30"),
  issuedAt: new Date("2026-05-11"),
  createdAt: new Date("2026-05-11"),
  updatedAt: new Date("2026-05-11"),
};

function makeQb(resolveWith: unknown) {
  const qb: Record<string, unknown> = {};
  for (const m of ["from", "where", "innerJoin", "orderBy", "limit"]) {
    qb[m] = () => qb;
  }
  qb.then = (onFulfilled?: (v: unknown) => unknown) =>
    Promise.resolve(resolveWith).then(onFulfilled);
  return qb;
}

describe("getAdminInvoices", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invoices for admin", async () => {
    vi.mocked(db.select).mockReturnValue(makeQb([mockInvoice]) as never);
    const result = await getAdminInvoices("admin-1");
    expect(result).toHaveLength(1);
    expect(result[0].invoiceNumber).toBe("INV-20260511-1234");
    expect(result[0].customerName).toBe("ACME s.r.o.");
    expect(db.select).toHaveBeenCalledOnce();
  });

  it("returns empty array when no invoices", async () => {
    vi.mocked(db.select).mockReturnValue(makeQb([]) as never);
    const result = await getAdminInvoices("admin-1");
    expect(result).toEqual([]);
  });
});

describe("getAdminInvoiceById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns invoice when found", async () => {
    vi.mocked(db.select).mockReturnValue(makeQb([mockInvoice]) as never);
    const result = await getAdminInvoiceById("inv-1", "admin-1");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("inv-1");
    expect(result?.status).toBe("issued");
  });

  it("returns null when invoice not found", async () => {
    vi.mocked(db.select).mockReturnValue(makeQb([]) as never);
    const result = await getAdminInvoiceById("inv-999", "admin-1");
    expect(result).toBeNull();
  });
});
