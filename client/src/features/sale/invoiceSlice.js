import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch invoice by custom invoiceId (not _id)
export const fetchInvoiceById = createAsyncThunk(
  "invoice/fetchById",
  async (invoiceId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getSaleById/${invoiceId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to fetch invoice"
      );
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoiceData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearInvoice: (state) => {
      state.invoiceData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceData = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
