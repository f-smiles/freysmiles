'use client'

import Link from "next/link"
import Image from "next/image"
import { VariantsWithProductImagesTags } from "@/lib/infer-type"
import { formatPrice } from "@/lib/format-price"

type ProductVariantsProps = {
  variants: VariantsWithProductImagesTags[]
}

export default function Variants({ variants }: ProductVariantsProps) {
  const row1 = variants.filter((v) => v.productID === 1);
  const row2 = variants.filter((v) => v.productID === 2);
  const row3 = variants.filter((v) => v.productID === 3 || v.productID === 4);
  const row4 = variants.filter((v) => v.productID === 5 || v.productID === 6 || v.productID === 7);

  const groupedVariants = [
    { label: "Cases", variants: row1 },
    { label: "Floss", variants: row2 },
    { label: "Whitening Gel", variants: row3 },
    { label: "Devices", variants: row4 },
  ];

  return (
    <div className="space-y-8">
      {groupedVariants.map((group, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-xl text-zinc-900">{group.label}</h2>
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.variants.map((variant, variantIndex) => (
                <div
                  key={variant.id}
                  className={`group text-sm p-4 flex flex-col justify-between ${
                    variantIndex !== group.variants.length - 1 ? '' : ''
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
        </div>
      ))}
    </div>
  );
}
