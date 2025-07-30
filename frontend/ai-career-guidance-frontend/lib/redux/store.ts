import { configureStore } from '@reduxjs/toolkit';

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
  // Add middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
