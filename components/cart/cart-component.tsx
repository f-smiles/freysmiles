'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBagIcon } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer"
import CartHeader from "./cart-header"
import CartItems from "./cart-items"
import CartProgress from "./cart-progress"
import PickupLocation from "./pickup-location"
import CartSummary from "./cart-summary"


export default function CartComponent() {
  const { cart, checkoutProgress, cartOpen, setCartOpen } = useCartStore()

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>

      <DrawerTrigger>
        <div className="relative">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center w-5 h-5 text-xs rounded-full -top-2 -right-3 bg-primary text-primary-foreground"
              >
                {cart.length}
              </motion.span>
            )}
            <ShoppingBagIcon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </AnimatePresence>
        </div>
      </DrawerTrigger>

      <DrawerContent className="fixed bottom-0 left-0 max-h-[80vh] min-h-[50vh] p-4">
        <DrawerHeader>
          <CartHeader />
        </DrawerHeader>

        {cart.length > 0 && (
          <CartProgress />
        )}

        <div className="overflow-auto">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "pickup-location" && <PickupLocation />}
          {checkoutProgress === "cart-summary" && <CartSummary />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
