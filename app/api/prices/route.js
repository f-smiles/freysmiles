import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// /api/prices
export async function GET(request) {
  const { data } = await stripe.prices.search({
    query: 'active:\'true\'',
    limit: 100,
  }, { apiKey: process.env.STRIPE_SECRET_KEY })
  return new Response(JSON.stringify(data))
}