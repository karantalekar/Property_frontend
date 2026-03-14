import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { store } from "@/redux/store";

/**
 * ✅ Hook to get auth token in components
 * Use this inside React components only
 * Redux with redux-persist handles persistence automatically
 */
export const useAuthToken = () => {
  return useSelector((state: RootState) => state.auth.auth_token);
};

/**
 * ✅ Utility to get auth token outside components
 * Use this in API functions, utilities, etc.
 * Uses Redux only (redux-persist handles persistence)
 */
export const getAuthToken = (): string | null => {
  // Get from Redux (redux-persist automatically restores on app load)
  const reduxToken = store.getState().auth.auth_token;
  if (reduxToken) {
    console.log("✅ Token from Redux");
    return reduxToken;
  }

  console.log("❌ No token found in Redux");
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
 * ✅ Note: Persistence is handled automatically by redux-persist
 * No need to manually persist tokens to localStorage/sessionStorage
 * Redux store is persisted to localStorage at key: "root"
 */
