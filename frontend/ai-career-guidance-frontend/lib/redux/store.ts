import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from '../features/interviewSlice';

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    interview: interviewReducer,
    // Add other reducers here
  },
  // Add middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
