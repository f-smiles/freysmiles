import { z } from "zod"

export const InvoicePaymentIntentSchema = z.object({
  invoiceID: z.number(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
})