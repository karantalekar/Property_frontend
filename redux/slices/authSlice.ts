// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   name: string;
//   email: string;
// }

// interface AuthState {
//   user: User | null;
// }

// const initialState: AuthState = {
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//     },
//   },
// });

// export const { loginUser, logoutUser } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  auth_token: string | null; // ✅ ADDED TOKEN
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
    loginUser: (
      state,
      action: PayloadAction<{ user: User; auth_token: string }>,
    ) => {
      state.user = action.payload.user;
      state.auth_token = action.payload.auth_token; // ✅ STORE TOKEN
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.auth_token = null; // ✅ CLEAR TOKEN
      state.isAuthenticated = false;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
      if (action.payload) state.isAuthenticated = true;
    },
  },
});

export const { loginUser, logoutUser, setToken } = authSlice.actions;
export default authSlice.reducer;
