import { Suspense } from "react"
import ProductComponent from "."
import LoadingSingleProduct from "./loading"

export const generateMetadata = async ({ params }) => {
  const { productId } = params
  const product = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`)
    .then((res) => res.json())

  return {
    title: `${product.name}`,
    description: `${product.description}`
  }
}

async function getProduct(productId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`)
    return res.json()
  } catch(error) {
    throw new Error(error.message)
  }
}

export default async function Page({ params }) {
  const { productId } = params
  const product = await getProduct(productId)

  return (
    <Suspense fallback={<LoadingSingleProduct />}>
      <ProductComponent product={product} />
    </Suspense>
  )
}
