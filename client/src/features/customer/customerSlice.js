import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  mobile: '',
  address: '',
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer(state, action) {
      return { ...state, ...action.payload };
    },
    clearCustomer() {
      return { name: '', mobile: '', address: '' };
    },
  },
});

export const { setCustomer, clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
