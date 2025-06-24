// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import saleReducer from '../features/sale/saleSlice';
import cartReducer from '../features/cart/cartSlice';
import customerReducer from '../features/customer/customerSlice';
import productReducer from '../features/products/productsSlice';
import invoiceReducer from "../features/sale/invoiceSlice";

const store = configureStore({
  reducer: {
    sale: saleReducer,
    invoice: invoiceReducer,
    cart: cartReducer,
    customer: customerReducer,
    products: productReducer,
  },
});

export  {store};

