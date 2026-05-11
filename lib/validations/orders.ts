import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.string().uuid("Vyberte zákazníka"),
  notes: z.string().max(1000, "Max 1000 znaků").optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(
    ["draft", "pending", "confirmed", "shipped", "delivered", "cancelled"],
    { message: "Neplatný stav objednávky" }
  ),
});

export const addItemSchema = z.object({
  orderId: z.string().uuid(),
  productId: z.string().uuid("Vyberte produkt"),
  quantity: z.coerce
    .number({ message: "Zadej číslo" })
    .int("Musí být celé číslo")
    .positive("Musí být kladné"),
});

export type CreateOrderValues = z.infer<typeof createOrderSchema>;
export type UpdateStatusValues = z.infer<typeof updateStatusSchema>;
export type AddItemValues = z.infer<typeof addItemSchema>;
