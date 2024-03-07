import { Suspense } from "react"
import ProductsComponent from "."
import Loading from "./loading"

export const metadata = {
  title: "Products",
}

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`)
    return res.json()
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getPrices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/prices`)
    return res.json()
  } catch (error) {
    throw new Error(error.message)
  }
}

export default async function Page() {
  const products = await getProducts()
  const prices = await getPrices()

  return (
    <Suspense fallback={<Loading />}>
      <ProductsComponent products={products} prices={prices} />
    </Suspense>
  )
}
