import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bag: []
}

const bagSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    clearBag: (state) => {
      state.bag = []
    },
    addToBag: (state, action) => {
      const { product, quantity } = action.payload
      const existingItem = state.bag.find(
        (item) => item.product.id === product.id
      )
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.bag.push({ product, quantity })
      }
    },
    removeFromBag: (state, action) => {
      const { product } = action.payload
      state.bag = state.bag.filter((item) => item.product.id !== product.id)
    },
    incrementQuantity: (state, action) => {
      const { product } = action.payload
      const item = state.bag.find((item) => item.product.id === product.id)
      if (!item) {
        return;
      }
      item.quantity += 1
    },
    decrementQuantity: (state, action) => {
      const { product } = action.payload
      const item = state.bag.find((item) => item.product.id === product.id)
      if (!item || (item && item.quantity === 1)) {
        return;
      }
      item.quantity -= 1
    },
  },
})

export const selectBag = (state) => state.bag.bag

export const { clearBag, addToBag, removeFromBag, incrementQuantity, decrementQuantity } = bagSlice.actions

export default bagSlice.reducer
