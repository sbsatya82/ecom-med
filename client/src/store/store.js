import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartProduct';
import addressReducer from './addressSlice';
import orderReducer from './orderSlice';
import orderSliceReducer from './adminOrderSlice';

const isProduction = process.env.NODE_ENV === 'production';

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cartItem: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
    adminOrders: orderSliceReducer,
  },
  devTools: !isProduction,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: !isProduction,
      serializableCheck: !isProduction,
    }),
});
