// import { apiFetcher } from "@/API/api-fetcher";

// interface WishlistParams {
//   customer_id?: number;
//   product_id: number;
//   in_wishlist: boolean;
// }

// interface WishlistResponse {
//   jsonrpc: string;
//   id: number | null;
//   result: {
//     status: boolean;
//     message: string;
//     data?: any;
//   };
// }

// /**
//  * Add or remove item from wishlist
//  * If `customer_id` is not provided by the caller, this function falls back to `10`.
//  */
// export const updateWishlist = async (
//   params: WishlistParams,
// ): Promise<WishlistResponse> => {
//   try {
//     const cid = params.customer_id ?? 10;

//     const res = await apiFetcher("/wishlist", {
//       customer_id: cid,
//       product_id: params.product_id,
//       in_wishlist: params.in_wishlist,
//     });

//     return { result: res } as unknown as WishlistResponse;
//   } catch (error: any) {
//     console.error("❌ Wishlist update error:", error);
//     throw error;
//   }
// };

// /**
//  * Fetch user's wishlist items (uses fallback customer_id = 10 if not provided)
//  */
// export const getWishlistItems = async (
//   customerId?: number,
// ): Promise<WishlistResponse> => {
//   try {
//     const cid = customerId ?? 10;

//     const res = await apiFetcher("/wishlist", {
//       customer_id: cid,
//     });

//     return { result: res } as unknown as WishlistResponse;
//   } catch (error: any) {
//     console.error("❌ Fetch wishlist error:", error);
//     throw error;
//   }
// };

// /**
//  * Check if product is in wishlist (fallback customer_id = 10)
//  */
// export const checkWishlistStatus = async (
//   productId: number,
//   customerId?: number,
// ): Promise<boolean> => {
//   try {
//     const cid = customerId ?? 10;

//     const res = await apiFetcher("/wishlist", {
//       customer_id: cid,
//       product_id: productId,
//       check_status: true,
//     });

//     return (
//       (res?.status as boolean) || (res?.result?.status as boolean) || false
//     );
//   } catch (error: any) {
//     console.error("❌ Check wishlist status error:", error);
//     return false;
//   }
// };

// /**
//  * Clear entire wishlist (fallback customer_id = 10)
//  */
// export const clearUserWishlist = async (
//   customerId?: number,
// ): Promise<WishlistResponse> => {
//   try {
//     const cid = customerId ?? 10;

//     const res = await apiFetcher("/wishlist", {
//       customer_id: cid,
//       clear_wishlist: true,
//     });

//     return { result: res } as unknown as WishlistResponse;
//   } catch (error: any) {
//     console.error("❌ Clear wishlist error:", error);
//     throw error;
//   }
// };

import { apiFetcher } from "@/API/api-fetcher";

const DEFAULT_CUSTOMER_ID = 10;

interface WishlistParams {
  customer_id?: number;
  product_id: number;
  in_wishlist: boolean;
}

export interface WishlistResponse {
  status: boolean;
  message: string;
  data?: any;
}

/**
 * Add or Remove item from wishlist
 */
export const updateWishlist = async (
  params: WishlistParams,
): Promise<WishlistResponse> => {
  try {
    const customer_id = params.customer_id ?? DEFAULT_CUSTOMER_ID;

    const res = await apiFetcher("/wishlist", {
      customer_id,
      product_id: params.product_id,
      in_wishlist: params.in_wishlist,
    });

    return res;
  } catch (error) {
    console.error("❌ Wishlist update error:", error);
    throw error;
  }
};

/**
 * Fetch wishlist items
 */
export const getWishlistItems = async (
  customerId?: number,
): Promise<WishlistResponse> => {
  try {
    const customer_id = customerId ?? DEFAULT_CUSTOMER_ID;

    const res = await apiFetcher("/wishlist", {
      customer_id,
    });

    return res;
  } catch (error) {
    console.error("❌ Fetch wishlist error:", error);
    throw error;
  }
};

/**
 * Check if product exists in wishlist
 */
export const checkWishlistStatus = async (
  productId: number,
  customerId?: number,
): Promise<boolean> => {
  try {
    const customer_id = customerId ?? DEFAULT_CUSTOMER_ID;

    const res = await apiFetcher("/wishlist", {
      customer_id,
      product_id: productId,
      check_status: true,
    });

    return Boolean(res?.status);
  } catch (error) {
    console.error("❌ Check wishlist status error:", error);
    return false;
  }
};

/**
 * Clear user wishlist
 */
export const clearUserWishlist = async (
  customerId?: number,
): Promise<WishlistResponse> => {
  try {
    const customer_id = customerId ?? DEFAULT_CUSTOMER_ID;

    const res = await apiFetcher("/wishlist", {
      customer_id,
      clear_wishlist: true,
    });

    return res;
  } catch (error) {
    console.error("❌ Clear wishlist error:", error);
    throw error;
  }
};
