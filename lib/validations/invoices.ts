import { z } from "zod";

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid({ message: "Vyberte zákazníka" }),
  totalAmount: z.coerce
    .number({ message: "Zadejte částku" })
    .positive({ message: "Částka musí být kladná" }),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Zadejte platné datum (RRRR-MM-DD)" }),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["draft", "issued", "paid", "overdue", "cancelled"], {
    message: "Neplatný stav faktury",
  }),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>;
