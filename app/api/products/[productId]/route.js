import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// /api/products/:productId
export async function GET(request, { params }) {
  const { productId } = params

  const product = await stripe.products.retrieve(productId, {
    apiKey: process.env.STRIPE_SECRET_KEY
  })
  const { data } = await stripe.prices.search({
    query: `product:'${productId}'`,
  }, { apiKey: process.env.STRIPE_SECRET_KEY })

  const singleProduct = {
    ...product, 
    price: data[0].unit_amount / 100 
  }
  
  return new Response(JSON.stringify(singleProduct))
}