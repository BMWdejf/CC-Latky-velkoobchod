import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Jméno je povinné")
    .max(100, "Max 100 znaků"),
  lastName: z
    .string()
    .min(1, "Příjmení je povinné")
    .max(100, "Max 100 znaků"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
