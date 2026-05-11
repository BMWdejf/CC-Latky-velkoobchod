import { describe, it, expect } from "vitest";
import { createInvoiceSchema, updateInvoiceStatusSchema } from "./invoices";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("createInvoiceSchema", () => {
  it("passes with valid data", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: VALID_UUID,
      totalAmount: "5000",
      dueDate: "2026-06-30",
    });
    expect(result.success).toBe(true);
  });

  it("coerces string amount to number", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: VALID_UUID,
      totalAmount: "9999.99",
      dueDate: "2026-06-30",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.totalAmount).toBe(9999.99);
  });

  it("fails without customerId", () => {
    const result = createInvoiceSchema.safeParse({
      totalAmount: "5000",
      dueDate: "2026-06-30",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.customerId).toBeDefined();
  });

  it("fails with invalid uuid", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: "not-a-uuid",
      totalAmount: "5000",
      dueDate: "2026-06-30",
    });
    expect(result.success).toBe(false);
  });

  it("fails with negative amount", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: VALID_UUID,
      totalAmount: "-100",
      dueDate: "2026-06-30",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.totalAmount).toBeDefined();
  });

  it("fails with zero amount", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: VALID_UUID,
      totalAmount: "0",
      dueDate: "2026-06-30",
    });
    expect(result.success).toBe(false);
  });

  it("fails with wrong date format", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: VALID_UUID,
      totalAmount: "5000",
      dueDate: "30.06.2026",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.dueDate).toBeDefined();
  });

  it("fails with empty dueDate", () => {
    const result = createInvoiceSchema.safeParse({
      customerId: VALID_UUID,
      totalAmount: "5000",
      dueDate: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateInvoiceStatusSchema", () => {
  it.each(["draft", "issued", "paid", "overdue", "cancelled"])(
    "passes with status %s",
    (status) => {
      expect(updateInvoiceStatusSchema.safeParse({ status }).success).toBe(true);
    }
  );

  it("fails with invalid status", () => {
    expect(
      updateInvoiceStatusSchema.safeParse({ status: "pending" }).success
    ).toBe(false);
  });

  it("fails when status is missing", () => {
    expect(updateInvoiceStatusSchema.safeParse({}).success).toBe(false);
  });
});
