import { Metadata, ResolvingMetadata } from "next"
import { eq } from "drizzle-orm"
import { db } from "@/server/db"

import { formatPrice } from "@/lib/format-price"
import { products, productVariants } from "@/server/schema"
import { Separator } from "@/components/ui/separator"
import VariantName from "@/components/products/variant-name"
import SelectColor from "@/components/products/select-color"
import ProductCarousel from "@/components/products/product-carousel"
import AddToCart from "@/components/cart/add-to-cart"


type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  slug: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params, searchParams, slug }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const productVariant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, params.slug)
  })

  const product = await db.query.products.findFirst({
    where: eq(products.id, productVariant.productID)
  })

  return {
    title: `${product?.title} ${productVariant?.variantName}`,
    description: `${product?.title} - ${productVariant?.variantName}`,
  }
}


export const revalidate = 60

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: { variantImages: true, variantTags: true, product: true },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })

  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }))
    return slugID
  }
  return []
}


export default async function Page({ params }: Props) {
  const slugID = Number(params.slug)

  if (isNaN(slugID)) {
    console.error("Invalid slug ID:", params.slug)
    return null
  }

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, slugID),
    with: {
      product: {
        with: {
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  })

  const matchingVariant = variant?.product.productVariants.find((i) => i.id === variant.id)
  const variantImage = matchingVariant?.variantImages[0].url!


  if (variant) {
    return (
      <section className="flex flex-col w-full max-w-6xl min-h-screen px-4 mx-auto font-neue-montreal md:flex-row md:gap-8 lg:gap-12 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex-1">
          <ProductCarousel variants={variant.product.productVariants} />
        </div>

        <div className="flex flex-col flex-1 gap-2 pb-16 space-y-4">
          <div className="space-y-1">
            <h1 className="text-[14px] font-neuehaas45 ">{variant?.product.title}</h1>
            <VariantName variants={variant.product.productVariants} />
          </div>

          <Separator />

          <h1 className="text-xl text-gray-900 u font-neuehaas45">{formatPrice(variant?.product.price)}</h1>
          <div
            className="[&_*]:!font-neuehaas45 [&_*]:!text-[13px]"
            dangerouslySetInnerHTML={{ __html: variant?.product.description }}
          />

          <div className="space-y-2">
            <h3 className="text-[12px] font-neuehaas45 uppercase text-gray-900">Color</h3>
            <span className="inline-flex flex-wrap items-center gap-2">
              {variant?.product.productVariants.map((prodVar) => (
                <SelectColor key={prodVar.id} id={prodVar.id} productID={prodVar.productID} color={prodVar.color} variantName={prodVar.variantName} title={variant.product.title} />
              ))}
            </span>
          </div>

          <AddToCart price={variant.product.price} image={variantImage} />

        </div>
      </section>
    )
  }
}
