import { NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY)

// /api/checkout/checkout-sessions
export async function POST(req, res) {
  let origin = req.headers.get("origin") || "http://localhost:3000"

  let data = await req.json()
  let lineItems = data.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]],
          description: item.product.description,
          metadata: {
            id: item.product.id,
          },
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
     mode: "payment",
     line_items: lineItems,
     billing_address_collection: "auto",
     shipping_address_collection: {
       allowed_countries: ["US"],
     },
     automatic_tax: { enabled: true },
     success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${origin}/bag`
  })

  return NextResponse.json(session.url)
}