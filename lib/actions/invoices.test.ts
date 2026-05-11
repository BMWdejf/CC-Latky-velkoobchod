import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ActionResult } from "@/types";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/auth", () => ({
  auth: { getSession: vi.fn() },
}));

vi.mock("@/lib/db", () => ({
  db: { insert: vi.fn(), update: vi.fn() },
}));

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createInvoice, updateInvoiceStatus } from "./invoices";

const ADMIN_SESSION = {
  data: { user: { id: "admin-1", role: "admin" } },
};

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

function makeInsertChain(returning: unknown[]) {
  return {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(returning),
  };
}

function makeUpdateChain(returning: unknown[]) {
  return {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(returning),
  };
}

describe("createInvoice", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects to new invoice on success", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);
    vi.mocked(db.insert).mockReturnValue(
      makeInsertChain([{ id: "inv-new" }]) as never
    );

    await expect(
      createInvoice(
        null,
        makeFormData({
          customerId: "123e4567-e89b-12d3-a456-426614174000",
          totalAmount: "5000",
          dueDate: "2026-06-30",
        })
      )
    ).rejects.toThrow("REDIRECT:/dashboard/invoices/inv-new");
  });

  it("returns field errors for invalid data", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);

    const result = (await createInvoice(
      null,
      makeFormData({ customerId: "bad", totalAmount: "-1", dueDate: "" })
    )) as ActionResult;
    expect(result.success).toBe(false);
  });

  it("redirects to login when unauthenticated", async () => {
    vi.mocked(auth.getSession).mockResolvedValue({ data: null } as never);

    await expect(
      createInvoice(
        null,
        makeFormData({
          customerId: "123e4567-e89b-12d3-a456-426614174000",
          totalAmount: "5000",
          dueDate: "2026-06-30",
        })
      )
    ).rejects.toThrow("REDIRECT:/auth/login");
  });

  it("redirects non-admin to /account", async () => {
    vi.mocked(auth.getSession).mockResolvedValue({
      data: { user: { id: "u1", role: "customer" } },
    } as never);

    await expect(
      createInvoice(
        null,
        makeFormData({
          customerId: "123e4567-e89b-12d3-a456-426614174000",
          totalAmount: "5000",
          dueDate: "2026-06-30",
        })
      )
    ).rejects.toThrow("REDIRECT:/account");
  });
});

describe("updateInvoiceStatus", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success when status updated", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);
    vi.mocked(db.update).mockReturnValue(
      makeUpdateChain([{ id: "inv-1" }]) as never
    );

    const result = await updateInvoiceStatus(
      "inv-1",
      null,
      makeFormData({ status: "paid" })
    );
    expect(result.success).toBe(true);
  });

  it("sets issuedAt when status becomes issued", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);
    const setMock = vi.fn().mockReturnThis();
    vi.mocked(db.update).mockReturnValue({
      set: setMock,
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: "inv-1" }]),
    } as never);

    await updateInvoiceStatus("inv-1", null, makeFormData({ status: "issued" }));
    expect(setMock.mock.calls[0][0].issuedAt).toBeInstanceOf(Date);
  });

  it("does not set issuedAt for other statuses", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);
    const setMock = vi.fn().mockReturnThis();
    vi.mocked(db.update).mockReturnValue({
      set: setMock,
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: "inv-1" }]),
    } as never);

    await updateInvoiceStatus("inv-1", null, makeFormData({ status: "paid" }));
    expect(setMock.mock.calls[0][0].issuedAt).toBeUndefined();
  });

  it("returns error when invoice not found", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);
    vi.mocked(db.update).mockReturnValue(makeUpdateChain([]) as never);

    const result = await updateInvoiceStatus(
      "inv-999",
      null,
      makeFormData({ status: "paid" })
    );
    expect(result.success).toBe(false);
    expect(typeof result.error).toBe("string");
  });

  it("returns error for invalid status", async () => {
    vi.mocked(auth.getSession).mockResolvedValue(ADMIN_SESSION as never);

    const result = await updateInvoiceStatus(
      "inv-1",
      null,
      makeFormData({ status: "invalid" })
    );
    expect(result.success).toBe(false);
  });
});
