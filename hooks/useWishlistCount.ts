"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getWishlistItems } from "@/API/Wishlist";

export const useWishlistCount = () => {
  const user = useSelector((state: RootState) => state.auth);
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlistCount.count
  );

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (!user.user?.user_id) {
        setCount(0);
        return;
      }

      const res = await getWishlistItems(
        user.user.user_id
      );

      setCount(res?.data?.length || 0);
    };

    fetchCount();
  }, [
    user.user?.user_id,
    wishlistCount, // ✅ THIS FIXES IT
  ]);

  return { count };
};
