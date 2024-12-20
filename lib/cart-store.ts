import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Variant = {
  variantID: number;
  quantity: number;
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  variant: Variant;
}

export type CartState = {
  cart: CartItem[];
  checkoutProgress: "cart-page" | "pickup-location" | "cart-summary" | "redirect-message" | "payment-page" | "confirmation-page";
  pickupLocation: "" | "Allentown" | "Bethlehem" | "Schnecksville" | "Lehighton";
  setCheckoutProgress: (status: "cart-page" | "pickup-location" | "cart-summary" | "redirect-message" | "payment-page" | "confirmation-page") => void;
  setPickupLocation: (location: "" | "Allentown" | "Bethlehem" | "Schnecksville" | "Lehighton") => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (value: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      checkoutProgress: "cart-page",
      pickupLocation: "",
      setCartOpen: (value) => set({ cartOpen: value }),
      setCheckoutProgress: (status) => set((state) => ({ checkoutProgress: status })),
      setPickupLocation: (location) => set((state) => ({ pickupLocation: location })),
      clearCart: () => set({ cart: [] }),
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.variant.variantID === item.variant.variantID)

        if (existingItem) {
          const updateCart = state.cart.map((i) => {
            if (i.variant.variantID === item.variant.variantID) {
              return {
                ...i,
                variant: {
                  ...i.variant,
                  quantity: i.variant.quantity + item.variant.quantity,
                }
              }
            }
            return i
          })

          return { cart: updateCart }

        } else {
          return {
            cart: [
              ...state.cart,
              { ...item, variant: { variantID: item.variant.variantID, quantity: item.variant.quantity } }
            ]
          }
        }
      }),
      removeFromCart: (item) => set((state) => {
        const updateCart = state.cart.map((i) => {
          if (i.variant.variantID === item.variant.variantID) {
            return {
              ...i,
              variant: {
                ...i.variant,
                quantity: i.variant.quantity - 1,
              }
            }
          }
          return i
        })
        return {
          cart: updateCart.filter((item) => item.variant.quantity > 0),
          pickupLocation: "",
        }
      }),
    }),
    { name: "cart" },
  )
)