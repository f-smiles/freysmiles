import { db } from "@/server/db"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import placeholderImage from "@/public/images/placeholder-image.jpg"

export default async function DashboardProducts() {

  const data = await db.query.products.findMany({
    with: {
      productVariants: {
        with: { variantImages: true, variantTags: true }
      }
    },
    orderBy: (products, { desc }) => [desc(products.id)]
  })

  if (!data) throw new Error("Failed to fetch products data.")

  const products = data.map((product) => {
    // if there are no variants
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image:  placeholderImage.src,
        variants: [],
      }
    }
    // if there are variants
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.productVariants[0].variantImages[0].url,
      variants: product.productVariants,
    }
  })

  return (
    <DataTable columns={columns} data={products} />
  )
}
