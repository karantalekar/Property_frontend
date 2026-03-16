import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   name?: string;
//   phone?: string;
//   email?: string;
// }
interface User {
  id?: number; // user_id from API
  name?: string;
  email?: string;
  phone?: string; // optional phone
  wishlist_count?: number; // optional wishlist count
}
interface ProfileState {
  user: User | null;
  loading: boolean;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // ✅ SET PROFILE DATA (REPLACE ENTIRE PROFILE)
    setProfileData: (
      state,
      action: PayloadAction<{
        name?: string;
        phone?: string;
        email?: string;
      }>,
    ) => {
      state.user = {
        name: action.payload.name || state.user?.name || "",
        phone: action.payload.phone || state.user?.phone || "",
        email: action.payload.email || state.user?.email || "",
      };
      console.log("✅ Profile data set in Redux:", state.user);
    },

    // ✅ MERGE PROFILE DATA (KEEP EXISTING, UPDATE NEW)
    mergeProfileData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      } else {
        state.user = action.payload as User;
      }
      console.log("✅ Profile data merged in Redux:", state.user);
    },

    // ✅ UPDATE NAME ONLY
    updateName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.name = action.payload;
      } else {
        state.user = { name: action.payload };
      }
      console.log("✅ Name updated in Redux:", action.payload);
    },

    // ✅ UPDATE PHONE ONLY
    updatePhone: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.phone = action.payload;
      } else {
        state.user = { phone: action.payload };
      }
      console.log("✅ Phone updated in Redux:", action.payload);
    },

    // ✅ SET LOADING STATE
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ✅ CLEAR PROFILE (LOGOUT)
    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
      console.log("✅ Profile cleared from Redux");
    },
  },
});

export const {
  setProfileData,
  mergeProfileData,
  updateName,
  updatePhone,
  setLoading,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
