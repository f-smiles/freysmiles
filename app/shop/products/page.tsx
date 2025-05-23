import { db } from "@/server/db"
import Variants from "@/components/products/variants"
import Banner from "./banner"
import Hero from "./hero"

export const revalidate = 60 * 60

export default async function ProductsPage() {
  const data = await db.query.productVariants.findMany({
    with: {
      product: true,
      variantImages: true,
      variantTags: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })

  
  return (
    <div className="bg-[#F1F2F5]" >
      {/* <Banner /> */}
      <Hero />
      <section className="flex items-start justify-center w-full h-full min-h-screen px-4 sm:px-6 lg:px-8 ">
        <div className="px-4 py-16 mx-auto overflow-hidden uppercase font-neueroman max-w-7xl sm:px-6 sm:py-24 lg:px-8">
          <Variants variants={data} />
        </div>
      </section>
    </div>
  )
}