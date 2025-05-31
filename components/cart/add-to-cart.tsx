'use client'

import { useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "../ui/button"
import { MinusIcon, PlusIcon } from "lucide-react"

export default function AddToCart({ price, image }: { price: number, image: string }) {
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCartStore()

  const searchParams = useSearchParams()
  const title = searchParams.get("title")
  const variant = searchParams.get("variant")
  const variantID = Number(searchParams.get("id"))
  const productID = Number(searchParams.get("prodId"))

  if (!title || !variant || !variantID || !productID || !price || !image) {
    toast.error("Error loading product.")
    return redirect("/shop/products")
  }

  return (
    <>
<div className="flex gap-2 mb-4">

  <div className="flex flex-1 gap-2">
    <Button
      className="w-1/4 h-12"
      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      disabled={quantity <= 1}
    >
      <MinusIcon className="w-4 h-4" />
    </Button>

    <div className="w-1/2 h-12 flex items-center justify-center rounded-sm border border-gray-200 bg-gray-100 text-[12px]">
      QUANTITY: {quantity}
    </div>

    <Button
      className="w-1/4 h-12"
      onClick={() => setQuantity(quantity + 1)}
    >
      <PlusIcon className="w-4 h-4" />
    </Button>
  </div>


  <button
    onClick={() => {
      toast.success(`Added ${title} - ${variant} to your cart`)
      addToCart({
        id: productID,
        name: `${title} - ${variant}`,
        variant: { quantity, variantID },
        price,
        image,
      })
    }}
    className="flex-1 h-12 bg-[#A7EEB3] text-black text-[12px] font-semibold uppercase tracking-wide hover:bg-green-300 transition"
  >
    Add to Cart
  </button>
</div>
    </>
  )
}
