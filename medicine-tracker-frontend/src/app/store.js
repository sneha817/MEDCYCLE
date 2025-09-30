import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import medicineReducer from './slices/medicineSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medicines: medicineReducer,
    orders: orderReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});