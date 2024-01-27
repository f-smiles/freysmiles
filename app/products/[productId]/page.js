import SingleProductComponent from "."

export const generateMetadata = async ({ params, searchParams }) => {
  const { productId } = params
  const product = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`)
    .then((res) => res.json())

  return {
    title: `${product.name}`,
    description: `${product.description}`
  }
}

export default function Page({ params, searchParams }) {
  return (
    <SingleProductComponent params={params} />
  )
}