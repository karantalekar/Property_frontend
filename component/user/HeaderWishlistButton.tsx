'use client'
import { useWishlistCount } from "@/hooks/useWishlistCount";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistButton() {
  const { count } = useWishlistCount();
  const hasItems = count > 0;
  return (
    <div className="wishlist-button relative flex justify-center items-center">
      <Link
        href="/profile/?tab=wishlistInfo"
        aria-label="Wishlist"
        className="relative"
      >
        <Heart
          className={`h-6 w-6 transition cursor-pointer ${count ? "text-red-500" : "text-white"
            }`}
          fill={hasItems ? "currentColor" : "none"}
        />

        {hasItems && (
          <span
            className="absolute -top-2 -right-2 min-w-[18px] h-[18px]
              px-1 flex items-center justify-center
              rounded-full bg-white text-black text-[11px] font-semibold"
          >
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
