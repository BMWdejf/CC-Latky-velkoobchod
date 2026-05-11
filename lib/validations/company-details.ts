import { z } from "zod";

export const companyDetailsSchema = z.object({
  companyName: z.string().max(200, "Max 200 znaků").optional(),
  ico: z.string().max(20, "Max 20 znaků").optional(),
  vatNumber: z.string().max(30, "Max 30 znaků").optional(),
  invoiceStreet: z.string().max(200, "Max 200 znaků").optional(),
  invoiceCity: z.string().max(100, "Max 100 znaků").optional(),
  invoiceZipCode: z.string().max(20, "Max 20 znaků").optional(),
  invoicePhone: z.string().max(50, "Max 50 znaků").optional(),
  sendingStreet: z.string().max(200, "Max 200 znaků").optional(),
  sendingCity: z.string().max(100, "Max 100 znaků").optional(),
  sendingZipCode: z.string().max(20, "Max 20 znaků").optional(),
  sendingPhone: z.string().max(50, "Max 50 znaků").optional(),
});

export type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>;
