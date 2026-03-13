// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// export const useAuthToken = () => {
//   return useSelector((state: RootState) => state.auth.token);
// };

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { store } from "@/redux/store";

// ✅ React Hook - Use in components
export const useAuthToken = () => {
  return useSelector((state: RootState) => state.auth.token);
};

// ✅ Utility - Use in API functions (non-React)
export const getAuthToken = (): string | null => {
  // Priority 1: Redux (fastest)
  const reduxToken = (store as any).getState().auth.token;
  if (reduxToken) return reduxToken;

  // Priority 2: localStorage (persistence)
  return localStorage.getItem("auth_token");
};

// ✅ Full auth state hook
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
