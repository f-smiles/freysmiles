import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY)

// /api/webhook
export async function POST(req, res) {

  let event

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature"),
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch(err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    // On error, log and return the error message.
    if (err instanceof Error) console.log(err)
    console.log(`❌ Error message: ${errorMessage}`)
    return new Response(JSON.stringify(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    ))
  }

  // Successfully constructed event.
  console.log("✅ Success:", event.id)

  const permittedEvents = [
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed"
  ]

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object
          console.log(`💰 CheckoutSession status: ${data.payment_status}`)
          break
        case "payment_intent.payment_failed":
          data = event.data.object
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`)
          break
        case "payment_intent.succeeded":
          data = event.data.object
          console.log(`💰 PaymentIntent status: ${data.status}`)
          break
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return new Response(JSON.stringify(
        { message: "Webhook handler failed" },
        { status: 500 }
      ))
    }
  }

  // Return a response to acknowledge receipt of the event.
  return new Response(JSON.stringify({ message: "Received" }, { status: 200 }))
}
