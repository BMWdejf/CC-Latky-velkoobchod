import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(1, "Předmět je povinný")
    .max(255, "Max 255 znaků"),
  body: z
    .string()
    .min(1, "Zpráva je povinná")
    .max(5000, "Max 5000 znaků"),
});

export const addMessageSchema = z.object({
  ticketId: z.string().uuid(),
  body: z
    .string()
    .min(1, "Zpráva je povinná")
    .max(5000, "Max 5000 znaků"),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"], {
    message: "Neplatný stav ticketu",
  }),
});

export type CreateTicketValues = z.infer<typeof createTicketSchema>;
export type AddMessageValues = z.infer<typeof addMessageSchema>;
export type UpdateTicketStatusValues = z.infer<typeof updateTicketStatusSchema>;
