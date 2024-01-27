import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// /api/products
export async function GET(req) {
  const { data } = await stripe.products.search({
    query: 'active:\'true\'',
    limit: 100,
  }, { apiKey: process.env.STRIPE_SECRET_KEY })
  return new Response(JSON.stringify(data))
}