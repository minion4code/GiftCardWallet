import { configureStore } from '@reduxjs/toolkit';
import giftCardReducer from './slices/giftCardSlice';

export const store = configureStore({
  reducer: {
    giftCard: giftCardReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;