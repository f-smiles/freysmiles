'use client'
import { motion } from "framer-motion"
import { CreditCardIcon, ShoppingCartIcon, StoreIcon } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"


export default function CartProgress() {
  const { checkoutProgress } = useCartStore()

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative w-full h-2 max-w-sm min-w-64 bg-muted">
        <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full">
          <motion.span
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart-page" ? 0
                : checkoutProgress === "pickup-location" ? "50%"
                : "100%",
            }}
            className="absolute top-0 left-0 z-30 h-full ease-in-out bg-primary"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 }}
            className="z-50 p-2 rounded-full bg-primary text-primary-foreground"
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkoutProgress !== "cart-page" ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
            className="z-50 p-2 rounded-full bg-primary text-primary-foreground"
          >
            {checkoutProgress === "pickup-location" || checkoutProgress === "cart-summary" ? (
              <StoreIcon className="w-4 h-4" />
            ) : null}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "cart-summary" ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
            className="z-50 p-2 rounded-full bg-primary text-primary-foreground"
          >
            {checkoutProgress === "cart-summary" ? (
              <CreditCardIcon className="w-4 h-4" />
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
