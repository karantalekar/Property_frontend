// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   name?: string;
//   email: string;
// }

// interface AuthState {
//   user: User | null;
//   auth_token: string | null; // ✅ ADDED TOKEN
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   auth_token: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginUser: (
//       state,
//       action: PayloadAction<{ user: User; auth_token: string }>,
//     ) => {
//       state.user = action.payload.user;
//       state.auth_token = action.payload.auth_token; // ✅ STORE TOKEN
//       state.isAuthenticated = true;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//       state.auth_token = null; // ✅ CLEAR TOKEN
//       state.isAuthenticated = false;
//     },
//     setToken: (state, action: PayloadAction<string>) => {
//       state.auth_token = action.payload;
//       if (action.payload) state.isAuthenticated = true;
//     },
//   },
// });

// export const { loginUser, logoutUser, setToken } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  auth_token: string | null; // ✅ Store token here
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  auth_token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Login with user AND token
    loginUser: (
      state,
      action: PayloadAction<{ user: User; auth_token: string }>,
    ) => {
      state.user = action.payload.user;
      state.auth_token = action.payload.auth_token;
      state.isAuthenticated = true;
      console.log("✅ User logged in:", action.payload.user.email);
    },

    // ✅ Logout clears everything
    logoutUser: (state) => {
      state.user = null;
      state.auth_token = null;
      state.isAuthenticated = false;
      console.log("✅ User logged out");
    },

    // ✅ Set token immediately after OTP verification
    setToken: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
      if (action.payload) state.isAuthenticated = true;
      console.log("✅ Token set in Redux");
    },

    // ✅ Set user info (optional, separate from login)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { loginUser, logoutUser, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
