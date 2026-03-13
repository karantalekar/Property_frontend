// hooks/useProfile.ts
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useProfile = () => {
  return useSelector((state: RootState) => state.profile);
};
