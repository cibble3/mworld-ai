import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/menuReducer';
import pageLoaderReducer from './reducers/pageLoaderReducer';

// Create the store with middleware
export const store = configureStore({
  reducer: {
    menuState: menuReducer,
    pageLoader: pageLoaderReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 