import { apiFetcher } from "@/API/api-fetcher";
import { apiCore } from "@/API/apiCore";
import { Language, LANG_CONFIG } from "@/config/locale";
import { Langar } from "next/font/google";

export async function getTrendingProperties() {
  const result = await apiFetcher("/get/product", {
    lang: "en_001",
    company_id: 10,
  });
  return result?.data || [];
}

export async function getPropertyDetails({ slug }: { slug: string }) {
  // console.log(" Fetching property:", slug); // Debug
  const result = await apiFetcher(`/get/product/${slug}`, {
    lang: "en_001",
    company_id: 10,
  });
  return result?.data || null;
}

export async function getGalleryImages({ slug }: { slug: string }) {
  const result = await apiFetcher(`/get/product/gallery/${slug}`, {
    lang: "en_001",
    company_id: 10,
  });
  return result?.data || [];
}

export async function getPropertyTypes(lang: string = "en_US") {
  try {
    const result = await apiFetcher("/get/property_type", {
      lang: lang,
    });
    // console.log("This is property:", result);

    return result?.data || [];
  } catch (error) {
    console.error("Error fetching property types:", error);
    return [];
  }
}

export async function getAmenities(lang: string = "en_US") {
  try {
    const result = await apiFetcher("/get/amenities", {
      lang,
    });
    return result;
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }
}

export async function getFilteredProperties(filters: any) {
  // ✅ Calculate total guests (adults + children)
  const totalGuests = (filters.adults || 0) + (filters.children || 0);

  // ✅ Log what we're sending for debugging
  // console.log("🔍 Sending filters to API:", {
  //   city: filters.city || null,
  //   property_type: filters.propertyType || [],
  //   amenities: filters.amenities || [],
  //   check_in: filters.checkIn || null,
  //   check_out: filters.checkOut || null,
  //   guest_count: totalGuests || 0,
  //   rooms: filters.rooms || 1,
  //   page: filters.page || 1,
  //   page_size: filters.page_size || 3,
  // });

  const result = await apiFetcher("/get/product", {
    lang: "en_US",
    city: filters.city || null,
    property_type:
      filters.propertyType && filters.propertyType.length > 0
        ? filters.propertyType
        : [],
    amenities:
      filters.amenities && filters.amenities.length > 0
        ? filters.amenities
        : [],
    check_in: filters.checkIn || null,
    check_out: filters.checkOut || null,
    guest_count: totalGuests || 0,
    no_of_rooms: filters.rooms || 1,
    page: filters.page || 1,
    page_size: filters.page_size || 3,
    customer_id: 11444,
    company_id: 10,
  });

  return result?.data || [];
}

export const addReview = async (
  Lang: string,
  slug: string,
  company_id: number,
  reviewData: {
    auth_token: string;
    product_id: number;
    // customer_id: number;
    rating: number;
    review?: string;
  },
) => {
  const params = {
    lang: "en_US",
    slug,
    company_id,
    ...reviewData,
  };
  const response = await apiFetcher(`/create/review`, params, "POST");
  console.log("Review API response:", response);
  return response;
};

// ✅ Check property availability
export const getAvailability = async (
  slug: string,
  company_id: number,
  payload: any,
) => {
  try {
    const params = {
      slug,
      company_id,
      ...payload,
    };

    console.log(
      "🔍 getAvailability - Sending request to /check-availability with params:",
      params,
    );

    const response = await apiCore(`/check-availability`, params, "POST");

    console.log("🔍 getAvailability - Raw response from API:", response);

    // Handle JSON-RPC response structure
    if (response?.result) {
      console.log(
        "✅ getAvailability - Found result in response:",
        response.result,
      );
      return response.result;
    }

    // Check for error in response
    if (response?.error) {
      console.error("❌ getAvailability - API error:", response.error);
      throw new Error(response.error.message || "API error");
    }

    // Return the full response if no nested result
    const result = response || { available: false, message: "Unknown error" };
    console.log("✅ getAvailability - Returning:", result);
    return result;
  } catch (error) {
    console.error("❌ getAvailability catch error:", error);
    throw error;
  }
};

// ✅ Create a new booking
export const createBooking = async (payload: any) => {
  try {
    const params = { ...payload };
    const response = await apiCore(`/create-booking`, params, "POST");

    // Handle JSON-RPC response structure
    if (response?.result) {
      return response.result;
    }

    return response;
  } catch (error) {
    console.error("❌ createBooking error:", error);
    throw error;
  }
};

// ✅ Get customer booking history
export const bookingHistory = async (lang: Language, customer_id: number) => {
  try {
    const response = await apiCore(
      `/customer/bookings`,
      { lang: LANG_CONFIG[lang].odoo, customer_id },
      "POST",
    );

    // Handle JSON-RPC response structure
    if (response?.result) {
      return response.result;
    }

    return response;
  } catch (error) {
    console.error("❌ bookingHistory error:", error);
    throw error;
  }
};
