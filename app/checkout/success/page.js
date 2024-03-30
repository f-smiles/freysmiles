import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY)
import ThankYou from '.'

export default async function Page({ searchParams }) {
  if (!searchParams.session_id) {
    throw new Error("Please provide a valid session_id")
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(searchParams.session_id, {
    expand: ["line_items", "payment_intent"]
  })

  const paymentDetails = await stripe.paymentMethods.retrieve(checkoutSession.payment_intent.payment_method)

  return (
    <ThankYou checkoutSession={checkoutSession} paymentDetails={paymentDetails} />
  )
}