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
      <span className="flex items-center justify-between gap-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1)
            }
          }}
          disabled={quantity <= 1}
        >
          <MinusIcon className="w-5 h-4" />
        </Button>
        <Button variant="secondary" className="flex-1 text-primary">Quantity: {quantity}</Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1)
          }}
        >
          <PlusIcon className="w-5 h-4" />
        </Button>
      </span>
      <Button
        className="w-full"
        onClick={() => {
          toast.success(`Added ${title} - ${ variant} to your cart`)
          addToCart({
            id: productID,
            name: `${title} - ${variant}`,
            variant: { quantity, variantID },
            price,
            image,
          })
        }}
      >
        Add to cart
      </Button>
    </>
  )
}
