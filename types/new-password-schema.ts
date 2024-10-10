import { z } from "zod"

export const NewPasswordSchema = z.object({
  password: z.string({ required_error: "Password cannot be empty." }),
  token: z.string().nullable().optional(),
}).refine((data) => {
  if (data.password) {
    // TODO: add a check for password match
    const passwordComplexity = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    if (!passwordComplexity.test(data.password)) {
      return false
    }
  }
  return true
}, {
  message: "Password must be at least 8 characters long, and contain at least one uppercase letter, one number, and one special character.",
  path: ["password"]
})