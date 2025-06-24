// src/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // array of { prodId, name, price, quantity }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.prodId === newItem.prodId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cartItems.push(newItem);
      }
    },

    removeFromCart: (state, action) => {
      const prodId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.prodId !== prodId
      );
    },

    updateCartQuantity: (state, action) => {
      const { prodId, quantity, totalPrice  } = action.payload;
      const item = state.cartItems.find((item) => item.prodId === prodId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = totalPrice;
      }
    },

    resetCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;



