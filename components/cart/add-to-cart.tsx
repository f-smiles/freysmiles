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

<div className="mb-6">


  <div className="flex items-center justify-between w-48 h-12 px-6 border border-gray-200 bg-white">
    <button
      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
      disabled={quantity <= 1}
      className="text-xl text-gray-500 hover:text-black transition disabled:opacity-30"
    >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
</svg>

    </button>

    <span className="text-base font-neuehaas45 text-black">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity(quantity + 1)}
      className="text-xl text-gray-500 hover:text-black transition"
    >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

    </button>
  </div>
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
