import { stripe } from "@/lib/stripe"
import type { Stripe } from "stripe"
import SuccessMessage from "./success-message"


export default async function SuccessPage({ searchParams }: { searchParams: { session_id: string } }) {

  if (!searchParams.session_id) {
    throw new Error("No valid session_id provided")
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(searchParams.session_id, {
    expand: ["line_items", "payment_intent"],
  })
  // const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent
  // const lineItems = checkoutSession.line_items

  // const order = await stripe.paymentIntents.retrieve(paymentIntent.id)
  // const charge = await stripe.charges.retrieve(order.latest_charge as string)
  // const receipt = charge.receipt_url
  const parseCheckoutSession = JSON.parse(JSON.stringify(checkoutSession))


  return (
    <div className="flex items-start justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 dark:bg-primary lg:py-48">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        <SuccessMessage checkoutSession={parseCheckoutSession} />
      </div>
    </div>
  )
}