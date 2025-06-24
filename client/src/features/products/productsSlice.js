// features/products/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Thunks for API calls ---

// Fetch all products
export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get("http://localhost:5000/api/getAllProducts");
    return response.data.products;
  }
);

// Fetch a single product by ID
export const fetchProductByIdAsync = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const response = await axios.get(`http://localhost:5000/api/getProduct/${id}`);
    return response.data.product;
  }
);

// Add a new product
export const addProductAsync = createAsyncThunk(
  "products/addProduct",
  async (newProduct) => {
    const response = await axios.post("http://localhost:5000/api/addproduct", newProduct);
    return response.data.product;
  }
);

// Update an existing product
export const updateProductAsync = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct) => {
    const response = await axios.put(
      `http://localhost:5000/api/updateProduct/${updatedProduct._id}`,
      updatedProduct
    );
    return response.data.product;
  }
);

// Delete a product
export const deleteProductAsync = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axios.delete(`http://localhost:5000/api/deleteProduct/${id}`);
    return id; // return product ID for removal from the state
  }
);

// --- Slice definition ---
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
  },
  reducers: {
     // Set product for editing (used to prefill the form with product details)
    setProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    
    // Clear selected product when switching between add and edit
    clearSelectedProduct: (state) => {
      state.selectedProduct = null; // Clear selected product
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetch a single product
    builder.addCase(fetchProductByIdAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductByIdAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Create product
    builder.addCase(addProductAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addProductAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload); // Add new product to state
    });
    builder.addCase(addProductAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Update product
    builder.addCase(updateProductAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      ); // Update product in the list
    });
    builder.addCase(updateProductAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Delete product
    builder.addCase(deleteProductAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProductAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      ); // Remove product from list
    });
    builder.addCase(deleteProductAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

// Actions exported
export const { setProduct, clearSelectedProduct } = productsSlice.actions;

// Reducer exported
export default productsSlice.reducer;