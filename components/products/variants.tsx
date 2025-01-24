'use client'

import Link from "next/link"
import Image from "next/image"
import { VariantsWithProductImagesTags } from "@/lib/infer-type"
import { formatPrice } from "@/lib/format-price"


type ProductVariantsProps = {
  variants: VariantsWithProductImagesTags[]
}

export default function Variants({ variants }: ProductVariantsProps) {

  const groupedVariants = [];
  const rowSize = 4; 
  for (let i = 0; i < variants.length; i += rowSize) {
    groupedVariants.push(variants.slice(i, i + rowSize));
  }

  return (
<div className="space-y-8">
  {groupedVariants.map((group, index) => (
    <div key={index} className="border border-gray-800 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {group.map((variant, variantIndex) => (
           <div
           key={variant.id}
           className={`group text-sm p-4 flex flex-col justify-between ${
             variantIndex < 3 ? 'border-r border-gray-800 h-full' : ''
           }`}
         >
           <Link
  href={`/shop/products/${variant.id}?id=${variant.id}&title=${variant.product.title}&variant=${variant.variantName}&prodId=${variant.productID}`}
>
  <figure className="w-full overflow-hidden rounded-md aspect-h-1 aspect-w-1 group-hover:opacity-75 transition-opacity">
    <Image
      className="object-cover object-center w-full h-full"
      src={variant.variantImages[0].url}
      alt={`${variant.product.title} - ${variant.variantName}`}
      width={360}
      height={640}
      priority
    />
  </figure>

  <h3 className="mt-4 text-lg font-medium text-zinc-900">
    {variant.product.title}
  </h3>

  <div className="w-full flex justify-between">
    <span className="font-neue-montreal text-sm text-zinc-500">
      {variant.variantName}
    </span>
    <span className="font-neue-montreal text-sm font-bold text-zinc-900">
      {formatPrice(variant.product.price)}
    </span>
  </div>
</Link>

          </div>
        ))}
      </div>
    </div>
  ))}
</div>

  
  );
}

