import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// /api/products
export async function GET(req, res) {
  try {
    const { data } = await stripe.products.search({
      query: 'active:\'true\'',
      limit: 100,
    }, { apiKey: process.env.STRIPE_SECRET_KEY })
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(err.message)
  }
}