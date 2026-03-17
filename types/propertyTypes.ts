export type Amenity = {
  id: number;
  name: string;
  image: string;
};

export type facilities = {};
export type PropertyTypes = {
  id: number;
  name: string;
  list_price: number;
  slug: string;
  rating: number;
  review_count: number;
  night_count: number;
  image_1920: string;
  discount_value?: number;
  discount_name?: string;
  images: string[];
  amenities: Amenity[];
  is_pets_allowed: boolean;
  longitude: string;
  latitude: string;
  facilities: facilities[];
  is_food_available: boolean;
  city_name: string;
  no_of_rooms: number;
  no_of_guest: number;
  in_wishlist: boolean;
};
export type PropertyApiResponse = {
  data: PropertyTypes[];
};

// types/propertyFilters.ts
// export type PropertyFilters = {
//   city?: string;
//   propertyTypes?: string[];
//   amenities?: string[];
//   priceMin?: number;
//   priceMax?: number;
//   adults?: number;
//   children?: number;
//   pets?: boolean;
// };

export type PropertyFilters = {
  city?: number;
  propertyTypes?: number[];
  amenities?: number[];
  priceMin?: number;
  priceMax?: number;
  adults?: number;
  children?: number;
  pets?: boolean; // <-- boolean now
  checkIn?: string;
  checkOut?: string;
  sort_by?: string;
  order?: string;
  guestCount?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type wishlistPayload = {
  customer_id: number;
  product_id: number;
  in_wishlist: boolean;
};

export interface PropertyTypeItem {
  id: number;
  name: string;
  image: string;
}
