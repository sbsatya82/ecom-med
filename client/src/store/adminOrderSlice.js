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
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderToUpdate = state.orders.find(order => order.orderId === orderId);
      if (orderToUpdate) {
        orderToUpdate.status = status;
      }
    }
  }
})


export const { setOrders, updateOrderStatus } = adminOrderSlice.actions


export default adminOrderSlice.reducer;