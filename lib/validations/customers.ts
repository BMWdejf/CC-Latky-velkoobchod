import { z } from "zod";

export const customerSchema = z.object({
  companyName: z
    .string()
    .min(1, "Název firmy je povinný")
    .max(200, "Max 200 znaků"),
  contactName: z.string().max(200, "Max 200 znaků").optional(),
  email: z
    .string()
    .email("Neplatný formát emailu")
    .max(254, "Max 254 znaků")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(50, "Max 50 znaků").optional(),
  address: z.string().max(500, "Max 500 znaků").optional(),
  userId: z.string().max(255).optional(),
});

export type CustomerValues = z.infer<typeof customerSchema>;

export const customerUpdateSchema = customerSchema.partial();
export type CustomerUpdateValues = z.infer<typeof customerUpdateSchema>;
