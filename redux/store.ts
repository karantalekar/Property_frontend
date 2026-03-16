// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import profileReducer from "./slices/profileSlice";
// import newsletterReducer from "./slices/newsletterSlice";
// import { persistReducer, persistStore } from "redux-persist";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// import wishlistReducer from "./slices/Wishlistslice";
// const createNoopStorage = () => {
//   return {
//     getItem(_key: string) {
//       return Promise.resolve(null);
//     },
//     setItem(_key: string, value: string) {
//       return Promise.resolve(value);
//     },
//     removeItem(_key: string) {
//       return Promise.resolve();
//     },
//   };
// };

// const storage =
//   typeof window !== "undefined"
//     ? createWebStorage("local")
//     : createNoopStorage();

// // Clean up any stale `wishlist` key left in persisted state from previous runs.
// // This prevents redux-persist from warning about unexpected keys when the
// // store no longer includes the `wishlist` reducer.
// if (typeof window !== "undefined") {
//   try {
//     const raw = window.localStorage.getItem("root");
//     if (raw) {
//       const parsed = JSON.parse(raw);
//       if (
//         parsed &&
//         typeof parsed === "object" &&
//         Object.prototype.hasOwnProperty.call(parsed, "wishlist")
//       ) {
//         delete (parsed as any)["wishlist"];
//         window.localStorage.setItem("root", JSON.stringify(parsed));
//       }
//     }
//   } catch (e) {
//     // Non-fatal: if cleanup fails, we still proceed — the warning may appear.
//     // Keep the console quiet in normal runs.
//     // eslint-disable-next-line no-console
//     console.warn("Could not clean persisted wishlist key:", e);
//   }
// }

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth", "profile"],
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   profile: profileReducer,
//   newsletter: newsletterReducer,
//   wishlist: wishlistReducer, // ✅ add this

//   // wishlist reducer intentionally not included here
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import newsletterReducer from "./slices/newsletterSlice";
import wishlistReducer from "./slices/Wishlistslice";

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
