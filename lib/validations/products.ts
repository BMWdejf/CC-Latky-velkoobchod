import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Název je povinný").max(200, "Max 200 znaků"),
  description: z.string().optional(),
  price: z.coerce
    .number({ message: "Zadej číslo" })
    .positive("Cena musí být kladná")
    .multipleOf(0.01, "Max 2 desetinná místa"),
  stock: z.coerce
    .number({ message: "Zadej číslo" })
    .int("Musí být celé číslo")
    .min(0, "Min 0")
    .default(0),
  sku: z.string().max(100, "Max 100 znaků").optional(),
});

export type ProductValues = z.infer<typeof productSchema>;

export const productUpdateSchema = productSchema.partial();
export type ProductUpdateValues = z.infer<typeof productUpdateSchema>;
