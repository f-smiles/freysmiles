import { stripe } from "@/lib/stripe"
import type { Stripe } from "stripe"
import SuccessMessage from "./success-message"


export default async function SuccessPage({ searchParams }: { searchParams: { payment_intent: string } }) {

  if (!searchParams.payment_intent) {
    throw new Error("No valid payment_intent provided")
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
  const parsePaymentIntent = JSON.parse(JSON.stringify(paymentIntent))


  return (
    <div className="flex items-start justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary lg:py-48">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        <SuccessMessage invoiceOrder={parsePaymentIntent} />
      </div>
    </div>
  )
}