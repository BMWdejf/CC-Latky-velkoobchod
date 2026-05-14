import { z } from "zod";

const optionalNumeric = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce
    .number({ message: "Zadej číslo" })
    .positive("Musí být kladné")
    .multipleOf(0.01, "Max 2 desetinná místa")
    .optional()
);

const optionalUuid = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().uuid("Neplatná kategorie").optional()
);

export const productSchema = z.object({
  name: z.string().min(1, "Název je povinný").max(200, "Max 200 znaků"),
  slug: z
    .string()
    .min(1, "Slug je povinný")
    .max(200, "Max 200 znaků")
    .regex(/^[a-z0-9-]+$/, "Pouze malá písmena, čísla a pomlčky"),
  description: z.string().optional(),
  price: z.coerce
    .number({ message: "Zadej číslo" })
    .positive("Cena musí být kladná")
    .multipleOf(0.01, "Max 2 desetinná místa"),
  compareAtPrice: optionalNumeric,
  stock: z.coerce
    .number({ message: "Zadej číslo" })
    .int("Musí být celé číslo")
    .min(0, "Min 0")
    .default(0),
  sku: z.string().max(100, "Max 100 znaků").optional(),
  weight: optionalNumeric,
  dimensions: z.string().max(100, "Max 100 znaků").optional(),
  status: z.enum(["active", "inactive"]).default("inactive"),
  categoryId: optionalUuid,
});

export type ProductValues = z.infer<typeof productSchema>;

export const productUpdateSchema = productSchema.partial();
export type ProductUpdateValues = z.infer<typeof productUpdateSchema>;
