import { z } from "zod"

export const RequestResetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
})