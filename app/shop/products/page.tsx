import { db } from "@/server/db"
import Variants from "@/components/products/variants"
import Banner from "./banner"
import Hero from "./hero"
import Preloader from "./hero"
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
    <>
          <Hero />
      <div className="bg-[#F1F2F5]">
        <section className="flex items-start justify-center w-full min-h-screen">
          <Variants variants={data} />
        </section>
      </div>
    </>
      )
}