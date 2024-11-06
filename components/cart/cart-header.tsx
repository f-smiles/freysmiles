'use client'

import { useCartStore } from "@/lib/cart-store"
import { DrawerDescription, DrawerTitle } from "../ui/drawer"
import { ArrowLeftIcon } from "lucide-react"

export default function CartHeader() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore()

  return (
    <div className="pb-4 my-2 space-y-2 text-center text-primary">
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "Cart" : null}
        {checkoutProgress === "pickup-location" ? "Choose a pickup location" : null}
        {checkoutProgress === "cart-summary" ? "Cart Summary" : null}
      </DrawerTitle>
      <DrawerDescription>
        {checkoutProgress === "cart-page" ? "  View and edit your bag" : null}
        {checkoutProgress === "pickup-location" || checkoutProgress === "cart-summary" ? (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
          >
            <ArrowLeftIcon size={14} /> Return to cart
          </span>
        ) : null}
      </DrawerDescription>
    </div>
  )
}
