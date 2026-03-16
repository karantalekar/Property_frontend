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
