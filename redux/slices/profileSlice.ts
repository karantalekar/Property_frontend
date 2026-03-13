// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface profileState {
//   user: {
//     name: string;
//     phone: string;
//     email: string;
//   } | null;
//   loading: boolean;
// }

// const initialState: profileState = {
//   user: null,
//   loading: false,
// };

// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     setProfileData: (
//       state,
//       action: PayloadAction<{ name: string; phone: string; email: string }>,
//     ) => {
//       state.user = action.payload;
//       state.loading = false;
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       // ✅ THIS WAS MISSING
//       state.loading = action.payload;
//     },
//     clearProfile: (state) => {
//       state.user = null;
//       state.loading = false;
//     },
//   },
// });

// export const { setProfileData, setLoading, clearProfile } =
//   profileSlice.actions; // ✅ EXPORTS setLoading
// export default profileSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name?: string;
  phone?: string;
  email?: string;
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
    // ✅ Set profile data
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
      console.log("✅ Profile data updated in Redux:", state.user);
    },

    // ✅ Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ✅ Clear profile (logout)
    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
      console.log("✅ Profile cleared");
    },

    // ✅ Merge profile data (keep existing, update new)
    mergeProfileData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      } else {
        state.user = action.payload as User;
      }
      console.log("✅ Profile merged:", state.user);
    },
  },
});

export const { setProfileData, setLoading, clearProfile, mergeProfileData } =
  profileSlice.actions;
export default profileSlice.reducer;
