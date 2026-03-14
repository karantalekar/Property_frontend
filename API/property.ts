import { apiFetcher } from "@/API/api-fetcher";

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
    console.log(result);

    return result;
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
  console.log("🔍 Sending filters to API:", {
    city: filters.city || null,
    property_type: filters.propertyType || [],
    amenities: filters.amenities || [],
    check_in: filters.checkIn || null,
    check_out: filters.checkOut || null,
    guest_count: totalGuests || 0,
    rooms: filters.rooms || 1,
    page: filters.page || 1,
    page_size: filters.page_size || 3,
  });

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
