// redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name?: string;
  email?: string;
  phone?: string;
  user_id?: number; // added
  wishlist_count?: number; // added
}

interface AuthState {
  user: User | null;
  auth_token: string | null;
  isAuthenticated: boolean;
  tempEmail?: string;
}

// --- load from localStorage (if present) ---
const saved = (() => {
  try {
    const raw = localStorage.getItem("auth_state_v1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState: AuthState = saved || {
  user: null,
  auth_token: null,
  isAuthenticated: false,
  tempEmail: undefined,
};

const persist = (state: AuthState) => {
  try {
    localStorage.setItem("auth_state_v1", JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to persist auth state:", err);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTemporaryToken: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
      console.log("✅ Temporary token set (for registration):", action.payload.substring(0, 20) + "...");
      // persist minimal state
      persist(state);
    },
    clearTemporaryToken: (state) => {
      state.auth_token = null;
      state.isAuthenticated = false;
      console.log("✅ Temporary token cleared");
      persist(state);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
      state.isAuthenticated = true;
      console.log("✅ Token set (logged in):", action.payload.substring(0, 20) + "...");
      persist(state);
    },
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
      console.log("✅ Temp email set in Redux:", action.payload);
      persist(state);
    },
    clearTempEmail: (state) => {
      state.tempEmail = undefined;
      persist(state);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      console.log("✅ User set in Redux:", action.payload.email);
      persist(state);
    },
    loginUser: (
      state,
      action: PayloadAction<{
        user: User;
        auth_token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.auth_token = action.payload.auth_token;
      state.isAuthenticated = true;
      state.tempEmail = undefined;
      console.log("✅ User logged in via Redux:", action.payload.user.email);
      persist(state);
    },
    logoutUser: (state) => {
      state.user = null;
      state.auth_token = null;
      state.isAuthenticated = false;
      state.tempEmail = undefined;
      console.log("✅ User logged out");
      try {
        localStorage.removeItem("auth_state_v1");
      } catch {}
    },
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
      persist(state);
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