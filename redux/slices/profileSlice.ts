import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface profileState {
  user: {
    name: string;
    phone: string;
    email: string;
  } | null;
  loading: boolean;
}

const initialState: profileState = {
  user: null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (
      state,
      action: PayloadAction<{ name: string; phone: string; email: string }>,
    ) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      // ✅ THIS WAS MISSING
      state.loading = action.payload;
    },
    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setProfileData, setLoading, clearProfile } =
  profileSlice.actions; // ✅ EXPORTS setLoading
export default profileSlice.reducer;
