"use server"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { actionClient } from "@/lib/safe-action"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { invoices, users } from "@/server/schema"
import { TreatmentOrderSchema } from "@/types/treatment-order-schema"


export const createTreatmentOrder = actionClient
  .schema(TreatmentOrderSchema)
  .action(async ({ parsedInput: { userEmail, amount, description } }) => {
    try {
      const user = await auth()
      if (user?.user.role !== "admin") return { error: "Only admins have access to this feature" }

      const customer = await db.query.users.findFirst({
        where: eq(users.email, userEmail)
      })

      if (!customer) {
        return { error: "No user registered with that email." }
      }

      const order = await db.insert(invoices).values({
        status: "awaiting payment",
        description,
        total: amount,
        userID: customer.id,
      }).returning()

      revalidatePath("/dashboard/billing")

      return {
        success: `Order was created for user: ${customer.email}.`
      }
    } catch (error) {
      return { error: "Error creating order for user" }
    }
  })