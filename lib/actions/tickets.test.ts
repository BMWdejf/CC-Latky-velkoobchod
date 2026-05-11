import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetSession = vi.fn();
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const mockRevalidatePath = vi.fn();
const mockDbInsertValues = vi.fn();
const mockDbInsertReturning = vi.fn();
const mockDbUpdate = vi.fn();
const mockDbSelectLimit = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: { getSession: mockGetSession },
}));
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));
vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@/lib/queries/account-orders", () => ({
  getCustomerByUserId: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  db: {
    insert: () => ({
      values: () => ({
        returning: mockDbInsertReturning,
      }),
    }),
    update: () => ({ set: () => ({ where: mockDbUpdate }) }),
    select: () => ({
      from: () => ({
        where: () => ({ limit: mockDbSelectLimit }),
        innerJoin: () => ({
          where: () => ({ limit: mockDbSelectLimit }),
        }),
      }),
    }),
  },
}));

const adminSession = { user: { id: "admin-1", role: "admin" } };
const customerSession = { user: { id: "user-1", role: "customer" } };
const customerId = "cust-1";
const ticketId = "ticket-uuid-1234";

async function getGetCustomerByUserId() {
  const mod = await import("@/lib/queries/account-orders");
  return mod.getCustomerByUserId as ReturnType<typeof vi.fn>;
}

describe("lib/actions/tickets", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── createTicket ───────────────────────────────────────────────
  describe("createTicket", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { createTicket } = await import("./tickets");
      await expect(createTicket(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("redirects admin away from createTicket", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { createTicket } = await import("./tickets");
      await expect(createTicket(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/dashboard"
      );
    });

    it("returns error when customer not linked", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const getCustomerByUserId = await getGetCustomerByUserId();
      getCustomerByUserId.mockResolvedValueOnce(null);

      const { createTicket } = await import("./tickets");
      const result = await createTicket(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("returns validation error when subject is missing", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const getCustomerByUserId = await getGetCustomerByUserId();
      getCustomerByUserId.mockResolvedValueOnce({ id: customerId });

      const { createTicket } = await import("./tickets");
      const fd = new FormData();
      fd.set("body", "Potřebuji pomoc");
      const result = await createTicket(null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("creates ticket and redirects on valid data", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const getCustomerByUserId = await getGetCustomerByUserId();
      getCustomerByUserId.mockResolvedValueOnce({ id: customerId });
      mockDbInsertReturning.mockResolvedValueOnce([{ id: ticketId }]); // ticket insert
      mockDbInsertReturning.mockResolvedValueOnce(undefined);           // message insert

      const { createTicket } = await import("./tickets");
      const fd = new FormData();
      fd.set("subject", "Problém s objednávkou");
      fd.set("body", "Potřebuji pomoc s objednávkou.");

      await expect(createTicket(null, fd)).rejects.toThrow(
        `NEXT_REDIRECT:/account/support/${ticketId}`
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/account/support");
    });
  });

  // ── addMessage ─────────────────────────────────────────────────
  describe("addMessage", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { addMessage } = await import("./tickets");
      await expect(addMessage(null, new FormData())).rejects.toThrow(
        "NEXT_REDIRECT:/auth/login"
      );
    });

    it("returns validation error for missing body", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { addMessage } = await import("./tickets");
      const result = await addMessage(null, new FormData());
      expect(result).toMatchObject({ success: false });
    });

    it("customer — returns error when ticket not found", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const getCustomerByUserId = await getGetCustomerByUserId();
      getCustomerByUserId.mockResolvedValueOnce({ id: customerId });
      mockDbSelectLimit.mockResolvedValueOnce([]); // ticket not found

      const { addMessage } = await import("./tickets");
      const fd = new FormData();
      fd.set("ticketId", "550e8400-e29b-41d4-a716-446655440000");
      fd.set("body", "Zpráva");

      const result = await addMessage(null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("customer — adds message on valid access", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const getCustomerByUserId = await getGetCustomerByUserId();
      getCustomerByUserId.mockResolvedValueOnce({ id: customerId });
      mockDbSelectLimit.mockResolvedValueOnce([{ id: ticketId, status: "open" }]);
      mockDbInsertReturning.mockResolvedValueOnce(undefined);

      const { addMessage } = await import("./tickets");
      const fd = new FormData();
      fd.set("ticketId", "550e8400-e29b-41d4-a716-446655440000");
      fd.set("body", "Děkuji za odpověď.");

      const result = await addMessage(null, fd);
      expect(result).toMatchObject({ success: true });
    });

    it("admin — adds message on valid access", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit.mockResolvedValueOnce([{ id: ticketId }]); // admin access check
      mockDbInsertReturning.mockResolvedValueOnce(undefined);

      const { addMessage } = await import("./tickets");
      const fd = new FormData();
      fd.set("ticketId", "550e8400-e29b-41d4-a716-446655440000");
      fd.set("body", "Vaši požadavek jsme zpracovali.");

      const result = await addMessage(null, fd);
      expect(result).toMatchObject({ success: true });
    });
  });

  // ── updateTicketStatus ─────────────────────────────────────────
  describe("updateTicketStatus", () => {
    it("redirects to login when unauthenticated", async () => {
      mockGetSession.mockResolvedValueOnce({ data: null });
      const { updateTicketStatus } = await import("./tickets");
      await expect(
        updateTicketStatus(ticketId, null, new FormData())
      ).rejects.toThrow("NEXT_REDIRECT:/auth/login");
    });

    it("redirects customer away", async () => {
      mockGetSession.mockResolvedValueOnce({ data: customerSession });
      const { updateTicketStatus } = await import("./tickets");
      await expect(
        updateTicketStatus(ticketId, null, new FormData())
      ).rejects.toThrow("NEXT_REDIRECT:/account");
    });

    it("returns validation error for invalid status", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      const { updateTicketStatus } = await import("./tickets");
      const fd = new FormData();
      fd.set("status", "invalid");
      const result = await updateTicketStatus(ticketId, null, fd);
      expect(result).toMatchObject({ success: false });
    });

    it("updates status and returns success", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit.mockResolvedValueOnce([{ id: ticketId }]);
      mockDbUpdate.mockResolvedValueOnce(undefined);

      const { updateTicketStatus } = await import("./tickets");
      const fd = new FormData();
      fd.set("status", "in_progress");

      const result = await updateTicketStatus(ticketId, null, fd);
      expect(result).toMatchObject({ success: true });
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        `/dashboard/support/${ticketId}`
      );
    });

    it("returns error when ticket not found for this admin", async () => {
      mockGetSession.mockResolvedValueOnce({ data: adminSession });
      mockDbSelectLimit.mockResolvedValueOnce([]); // not found

      const { updateTicketStatus } = await import("./tickets");
      const fd = new FormData();
      fd.set("status", "resolved");

      const result = await updateTicketStatus("missing", null, fd);
      expect(result).toMatchObject({ success: false });
    });
  });
});
