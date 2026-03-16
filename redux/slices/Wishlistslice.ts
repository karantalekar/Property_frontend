// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface WishlistItem {
//   id: number;
//   name: string;
//   image_1920: string;
//   list_price: number;
//   rating: number;
//   review_count: number;
//   slug: string;
//   discount_value?: number;
//   amenities: Array<{ id: number; name: string; image: string }>;
//   city_name: string;
//   address: string;
// }

// interface WishlistState {
//   items: WishlistItem[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: WishlistState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     // Add item to wishlist
//     addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
//       const exists = state.items.find((item) => item.id === action.payload.id);
//       if (!exists) {
//         state.items.push(action.payload);
//       }
//     },

//     // Remove item from wishlist
//     removeFromWishlist: (state, action: PayloadAction<number>) => {
//       state.items = state.items.filter((item) => item.id !== action.payload);
//     },

//     // Check if item is in wishlist
//     isInWishlist: (state, action: PayloadAction<number>): boolean => {
//       return state.items.some((item) => item.id === action.payload);
//     },

//     // Set entire wishlist (from API)
//     setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
//       state.items = action.payload;
//     },

//     // Clear wishlist
//     clearWishlist: (state) => {
//       state.items = [];
//     },

//     // Set loading state
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },

//     // Set error
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const {
//   addToWishlist,
//   removeFromWishlist,
//   setWishlist,
//   clearWishlist,
//   setLoading,
//   setError,
// } = wishlistSlice.actions;

// export default wishlistSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface WishlistItem {
  id: number;
  name: string;
  image_1920: string;
  list_price: number;
  rating: number;
  review_count: number;
  slug: string;
  discount_value?: number;
  amenities: Array<{ id: number; name: string; image: string }>;
  city_name: string;
  address: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Add item
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    // Remove item
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Toggle wishlist (best practice)
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);

      if (exists) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
      } else {
        state.items.push(action.payload);
      }
    },

    // Set full wishlist from API
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.items = [];
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  setWishlist,
  clearWishlist,
  setLoading,
  setError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

/* ---------------- SELECTORS ---------------- */

// Get wishlist items
export const selectWishlistItems = (state: RootState) => state.wishlist.items;

// Check if item exists in wishlist
export const selectIsInWishlist = (productId: number) => (state: RootState) =>
  state.wishlist.items.some((item) => item.id === productId);
