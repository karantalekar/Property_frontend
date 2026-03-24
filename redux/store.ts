

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import newsletterReducer from "./slices/newsletterSlice";
import wishlistReducer from "./slices/Wishlistslice";
import wishlistCountReducer from "./slices/wishlistSliceCoun";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Fix for Next.js SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  newsletter: newsletterReducer,
  wishlist: wishlistReducer, // ✅ Wishlist added correctly
  wishlistCount: wishlistCountReducer, // ✅
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "profile", "wishlist"], // ✅ persist wishlist if needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
