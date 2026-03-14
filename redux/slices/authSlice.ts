import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  auth_token: string | null;
  isAuthenticated: boolean;
  tempEmail?: string; // ✅ Temporary email for OTP/registration flow
}

const initialState: AuthState = {
  user: null,
  auth_token: null,
  isAuthenticated: false,
  tempEmail: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ SET TOKEN FOR OTP VERIFICATION DURING REGISTRATION
    // Does NOT set isAuthenticated (user must log in via login flow)
    setTemporaryToken: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
      // ⚠️ Don't set isAuthenticated here - this is just for API calls during registration
      console.log(
        "✅ Temporary token set (for registration):",
        action.payload.substring(0, 20) + "...",
      );
    },

    // ✅ CLEAR TEMPORARY TOKEN
    clearTemporaryToken: (state) => {
      state.auth_token = null;
      state.isAuthenticated = false;
      console.log("✅ Temporary token cleared");
    },

    // ✅ SET TOKEN IMMEDIATELY AFTER LOGIN OTP VERIFICATION
    // Sets isAuthenticated to true (actual login)
    setToken: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
      state.isAuthenticated = true;
      console.log(
        "✅ Token set (logged in):",
        action.payload.substring(0, 20) + "...",
      );
    },

    // ✅ SET TEMPORARY EMAIL FOR OTP/REGISTRATION FLOW
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
      console.log("✅ Temp email set in Redux:", action.payload);
    },

    // ✅ CLEAR TEMPORARY EMAIL
    clearTempEmail: (state) => {
      state.tempEmail = undefined;
      console.log("✅ Temp email cleared");
    },

    // ✅ SET USER INFO (NAME, EMAIL)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      console.log("✅ User set in Redux:", action.payload.email);
    },

    // ✅ LOGIN USER - SETS BOTH USER AND TOKEN
    loginUser: (
      state,
      action: PayloadAction<{
        user: User;
        auth_token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.auth_token = action.payload.auth_token;
      state.isAuthenticated = true;
      state.tempEmail = undefined; // Clear temp email on successful login
      console.log("✅ User logged in via Redux:", action.payload.user.email);
    },

    // ✅ LOGOUT - CLEAR ALL AUTH DATA
    logoutUser: (state) => {
      state.user = null;
      state.auth_token = null;
      state.isAuthenticated = false;
      state.tempEmail = undefined;
      console.log("✅ User logged out");
    },

    // ✅ UPDATE USER ONLY (for profile updates)
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      } else {
        state.user = action.payload as User;
      }
      console.log("✅ User updated in Redux:", state.user);
    },
  },
});

export const {
  setTemporaryToken,
  clearTemporaryToken,
  setToken,
  setTempEmail,
  clearTempEmail,
  setUser,
  loginUser,
  logoutUser,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;
