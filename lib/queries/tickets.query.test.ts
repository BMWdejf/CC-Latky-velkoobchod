import { describe, it, expect, vi, beforeEach } from "vitest";

const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockWhere = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: mockOrderBy,
          limit: mockLimit,
        }),
        innerJoin: () => ({
          where: () => ({
            orderBy: mockOrderBy,
            limit: mockLimit,
          }),
        }),
      }),
    }),
  },
}));

const sampleTicket = {
  id: "ticket-1",
  subject: "Problém s objednávkou",
  status: "open",
  priority: "normal",
  customerId: "cust-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  customerName: "Testovací Textil s.r.o.",
};

describe("lib/queries/tickets", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getAdminTickets", () => {
    it("returns tickets for admin's customers", async () => {
      mockOrderBy.mockResolvedValueOnce([sampleTicket]);
      const { getAdminTickets } = await import("./tickets");
      const result = await getAdminTickets("admin-1");
      expect(result).toEqual([sampleTicket]);
    });

    it("returns empty array when no tickets", async () => {
      mockOrderBy.mockResolvedValueOnce([]);
      const { getAdminTickets } = await import("./tickets");
      const result = await getAdminTickets("admin-1");
      expect(result).toEqual([]);
    });
  });

  describe("getAdminTicketById", () => {
    it("returns null when ticket not found", async () => {
      mockLimit.mockResolvedValueOnce([]);
      const { getAdminTicketById } = await import("./tickets");
      const result = await getAdminTicketById("missing", "admin-1");
      expect(result).toBeNull();
    });

    it("returns ticket with messages", async () => {
      const message = {
        id: "msg-1",
        ticketId: "ticket-1",
        authorId: "user-1",
        body: "Potřebuji pomoc.",
        createdAt: new Date(),
      };
      mockLimit.mockResolvedValueOnce([sampleTicket]);
      mockOrderBy.mockResolvedValueOnce([message]);

      const { getAdminTicketById } = await import("./tickets");
      const result = await getAdminTicketById("ticket-1", "admin-1");

      expect(result?.subject).toBe("Problém s objednávkou");
      expect(result?.messages).toHaveLength(1);
    });
  });

  describe("getCustomerTickets", () => {
    it("returns tickets for the customer", async () => {
      const customerTicket = { ...sampleTicket, customerName: null };
      mockOrderBy.mockResolvedValueOnce([customerTicket]);
      const { getCustomerTickets } = await import("./tickets");
      const result = await getCustomerTickets("cust-1");
      expect(result).toEqual([customerTicket]);
    });
  });

  describe("getCustomerTicketById", () => {
    it("returns null when ticket not found or wrong customer", async () => {
      mockLimit.mockResolvedValueOnce([]);
      const { getCustomerTicketById } = await import("./tickets");
      const result = await getCustomerTicketById("ticket-1", "wrong-cust");
      expect(result).toBeNull();
    });

    it("returns ticket with messages for the correct customer", async () => {
      const customerTicket = { ...sampleTicket, customerName: null };
      mockLimit.mockResolvedValueOnce([customerTicket]);
      mockOrderBy.mockResolvedValueOnce([]);

      const { getCustomerTicketById } = await import("./tickets");
      const result = await getCustomerTicketById("ticket-1", "cust-1");

      expect(result?.subject).toBe("Problém s objednávkou");
      expect(result?.messages).toEqual([]);
    });
  });
});
