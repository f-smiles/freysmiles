'use client'

import Link from "next/link"
import Image from "next/image"
import { VariantsWithProductImagesTags } from "@/lib/infer-type"
import { formatPrice } from "@/lib/format-price"


type ProductVariantsProps = {
  variants: VariantsWithProductImagesTags[]
}

export default function Variants({ variants }: ProductVariantsProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {variants.map((variant) => (
        <Link
          key={variant.id}
          href={`/shop/products/${variant.id}?id=${variant.id}&title=${variant.product.title}&variant=${variant.variantName}&prodId=${variant.productID}`} className="text-sm group"
        >
          <figure className="w-full overflow-hidden rounded-md aspect-h-1 aspect-w-1 group-hover:opacity-75">
            <Image
              className="object-cover object-center w-full h-full"
              src={variant.variantImages[0].url}
              alt={`${variant.product.title} - ${variant.variantName}`}
              width={360}
              height={640}
              priority
            />
          </figure>

          <h3 className="mt-4 text-lg font-medium text-zinc-900">{variant.product.title}</h3>
          <p className="text-zinc-500">{variant.variantName}</p>
          <p className="font-medium text-zinc-900">{formatPrice(variant.product.price)}</p>
        </Link>
      ))}
    </div>
  )
}
