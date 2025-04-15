import { createSlice } from "@reduxjs/toolkit";
import fetchAllOrders from "../utils/AdminGetOrders";

const initialValue = {
    orders : []
}

const adminOrderSlice = createSlice({
  name : "admin orders",
  initialState : initialValue,
  reducers: {
    setOrders : (state, action) => {
      state.orders = action.payload;
    }
  }
})


export const { setOrders } = adminOrderSlice.actions


export default adminOrderSlice.reducer;