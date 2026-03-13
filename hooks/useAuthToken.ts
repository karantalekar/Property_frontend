// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { store } from "@/redux/store";

// // ✅ React Hook - Use in components
// export const useAuthToken = () => {
//   return useSelector((state: RootState) => state.auth.auth_token); // ✅ Changed: token → auth_token
// };

// // ✅ Utility - Use in API functions (non-React)
// export const getAuthToken = (): string | null => {
//   // Priority 1: Redux (fastest)
//   const reduxToken = (store as any).getState().auth.auth_token; // ✅ Changed: token → auth_token
//   if (reduxToken) return reduxToken;

//   // Priority 2: localStorage (persistence)
//   return localStorage.getItem("auth_token");
// };

// // ✅ Full auth state hook
// export const useAuth = () => {
//   const token = useAuthToken();
//   const { user, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth,
//   );

//   return {
//     token,
//     user,
//     isAuthenticated: !!token,
//   };
// };

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { store } from "@/redux/store";

/**
 * ✅ Hook to get auth token in components
 * Use this inside React components only
 */
export const useAuthToken = () => {
  return useSelector((state: RootState) => state.auth.auth_token);
};

/**
 * ✅ Utility to get auth token outside components
 * Use this in API functions, utilities, etc.
 * Has fallback to localStorage
 */
export const getAuthToken = (): string | null => {
  // Priority 1: Redux (fastest, updated in real-time)
  const reduxToken = store.getState().auth.auth_token;
  if (reduxToken) {
    console.log("✅ Token from Redux");
    return reduxToken;
  }

  // Priority 2: localStorage (persistence across page refreshes)
  const localToken = localStorage.getItem("auth_token");
  if (localToken) {
    console.log("✅ Token from localStorage");
    return localToken;
  }

  console.log("❌ No token found in Redux or localStorage");
  return null;
};

/**
 * ✅ Complete auth state hook
 * Returns token, user, and authentication status
 */
export const useAuth = () => {
  const token = useAuthToken();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    token,
    user,
    isAuthenticated: !!token,
  };
};

/**
 * ✅ Persist token to localStorage for persistence
 * Call this after setting token in Redux
 */
export const persistAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
  console.log("✅ Token persisted to localStorage");
};

/**
 * ✅ Clear all auth data
 * Call this on logout
 */
export const clearAuthData = () => {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("profileEmail");
  sessionStorage.removeItem("emailForOtp");
  console.log("✅ All auth data cleared");
};
