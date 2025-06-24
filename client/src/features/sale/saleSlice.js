import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to post a new sale
export const createSaleAsync = createAsyncThunk(
  "sale/createSaleAsync",
  async ({ saleData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/checkout", 
        saleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (error) {
      // Return a meaningful error message for rejected action
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to post sale"
      );
    }
  }
);

const saleSlice = createSlice({
  name: "sale",
  initialState: {
    sale: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSaleState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSaleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSaleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.sale = action.payload;
      })
      .addCase(createSaleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to post sale";
        state.success = false;
      });
  },
});

export const { resetSaleState } = saleSlice.actions;

export default saleSlice.reducer;


