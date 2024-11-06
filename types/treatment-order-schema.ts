import { z } from "zod"

export const TreatmentOrderSchema = z.object({
  userEmail: z.string().email(),
  amount: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be a positive number." }),
  description: z.string().min(1, { message: "Please provide a description of the charge." }),
  status: z.string(),
  receiptURL: z.string().nullable(),
  paymentIntentID: z.string().nullable(),
})