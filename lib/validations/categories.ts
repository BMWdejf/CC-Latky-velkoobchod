import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Název je povinný").max(100, "Max 100 znaků"),
  slug: z
    .string()
    .min(1, "Slug je povinný")
    .max(100, "Max 100 znaků")
    .regex(/^[a-z0-9-]+$/, "Pouze malá písmena, čísla a pomlčky"),
  description: z.string().optional(),
});

export type CategoryValues = z.infer<typeof categorySchema>;

export const categoryUpdateSchema = categorySchema.partial();
export type CategoryUpdateValues = z.infer<typeof categoryUpdateSchema>;
