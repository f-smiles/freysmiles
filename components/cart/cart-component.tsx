'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBagIcon } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import CartHeader from "./cart-header"
import CartItems from "./cart-items"
import CartProgress from "./cart-progress"
import PickupLocation from "./pickup-location"
import CartSummary from "./cart-summary"


export default function CartComponent() {
  const { cart, checkoutProgress, cartOpen, setCartOpen } = useCartStore()

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger>
        <div className="relative">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-2 -right-3 bg-primary-0"
              >
                {cart.length}
              </motion.span>
            )}
            <ShoppingBagIcon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </AnimatePresence>
        </div>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[640px] md:w-[768px] bg-white flex flex-col z-[9999]">
        <SheetHeader>
          <CartHeader />
        </SheetHeader>

        {cart.length > 0 && (
          <CartProgress />
        )}
        <ScrollArea>
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "pickup-location" && <PickupLocation />}
          {checkoutProgress === "cart-summary" && <CartSummary />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
