import { z } from "zod"

export const SignupSchema = z.object({
  name: z.string().min(4, {
    message: "Name must have a minimum of 4 characters."
  }),
  email: z.string().email(),
  password: z.string({ required_error: "Password cannot be empty." })
    .regex(/^.{8,}$/, { message: "Password must have a minimum of 8 characters." })
    .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase character." })
    .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase character." })
    .regex(/(?=.*\d)/, { message: "Password must contain at least one numerical digit." })
    .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, { message: "Password must contain least one special character." }),
})