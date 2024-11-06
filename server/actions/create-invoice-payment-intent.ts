'use server'

import { eq } from "drizzle-orm"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { invoices, users } from "@/server/schema"
import { actionClient } from "@/lib/safe-action"
import { stripe } from "@/lib/stripe"
import { InvoicePaymentIntentSchema } from "@/types/invoice-payment-intent-schema"

export const createInvoicePaymentIntent = actionClient
  .schema(InvoicePaymentIntentSchema)
  .action(async ({ parsedInput: { invoiceID, amount, currency, description } }) => {
    try {
      const user = await auth()
      if (!user) return { error: "Please login to continue with your payment" }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id)
      })
      if (!dbUser) return { error: "No matching database user found" }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        description,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      await db
        .update(invoices)
        .set({paymentIntentID: paymentIntent.id})
        .where(eq(invoices.id, invoiceID))

      return {
        success: {
          clientSecret: paymentIntent.client_secret as string,
          userEmail: user.user.email as string,
          paymentIntentID: paymentIntent.id,
        }
      }
    } catch (error) {
      return { error: `Error: ${error}`}
    }
  })