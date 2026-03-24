"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { wishlistUpdated } from "@/redux/slices/wishlistSliceCoun";
import { updateWishlist } from "@/API/Wishlist";

export type WishlistButtonProps = {
  itemId: number;
  initial?: boolean;
  isWishlisted?: boolean;
  onToggle?: (newState: boolean) => void;
  className?: string;
  disabled?: boolean;
  size?: number;
  ariaLabel?: string;
};

export default function WishlistButton({
  itemId,
  initial = false,
  isWishlisted: controlledIsWishlisted,
  onToggle,
  className = "",
  disabled = false,
  size = 18,
  ariaLabel = "wishlist",
}: WishlistButtonProps) {
  const customerId = useSelector((state: RootState) => state.auth.user?.user_id);
  const [internalState, setInternalState] = useState<boolean>(initial);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Sync prop -> internal state when parent prop changes
  useEffect(() => {
    setInternalState(initial);
  }, [initial]);

  const isControlled = typeof controlledIsWishlisted === "boolean";
  const isWishlisted = isControlled ? controlledIsWishlisted! : internalState;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || loading) return;

    if (!customerId) {
      toast.error(`Log in to manage your wishlist.`);
      return;
    }

    const optimisticState = !isWishlisted;
    // optimistic update if uncontrolled
    if (!isControlled) setInternalState(optimisticState);
    setLoading(true);

    try {
      const resp = await updateWishlist({
        customer_id: customerId,
        product_id: itemId,
        in_wishlist: optimisticState,
      });

      // Prefer server's truth if available in response, otherwise use optimisticState
      const finalState = resp?.in_wishlist ?? optimisticState;

      if (!isControlled) setInternalState(finalState);

      onToggle?.(finalState);
      dispatch(wishlistUpdated());
      toast.success(finalState ? `Added to wishlist` : `Removed from wishlist`);
    } catch (err) {
      // rollback on error
      if (!isControlled) setInternalState(isWishlisted);
      console.error("Wishlist toggle error:", err);
      toast.error("Failed to update wishlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      className={`${className} p-2 rounded-full shadow transition ${isWishlisted ? "bg-red-100 hover:bg-red-200" : "bg-white hover:bg-gray-100"
        }`}
      type="button"
    >
      <Heart size={size} className={isWishlisted ? "text-red-500" : "text-gray-400"} fill={isWishlisted ? "red" : "none"} />
    </button>
  );
}
