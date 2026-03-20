"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FilterSidebar, {
  FilterState,
  defaultFilters,
} from "@/component/property/FilterSidebar";
import PropertyMap from "@/component/property/PropertyMap";
import {
  getFilteredProperties,
  getPropertyTypes,
  getAmenities,
} from "@/API/property";
import { getCityData } from "@/API/home";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/Wishlistslice";
import { updateWishlist } from "@/API/Wishlist";
import { getUserProfile } from "@/API/profile";
import { RootState } from "@/redux/store";
import {
  MapPin,
  Heart,
  Star,
  Home,
  Users,
  PawPrint,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Menu,
  X,
  Map,
} from "lucide-react";

const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

export type Property = {
  id: number;
  name: string;
  list_price: number;
  latitude: number;
  longitude: number;
  image_1920: string;
  night_count?: number;
  is_food_available?: boolean;
  is_pets_allowed?: boolean;
  no_of_rooms?: number;
  no_of_guest?: number;
  rating?: number;
  review_count?: number;
  city_name?: string;
  amenities?: { id: number; name: string; image: string }[];
  [key: string]: any;
};

export default function FilteredProperties() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();

  // Redux selectors
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items ?? [],
  );
  const authToken = useSelector((state: RootState) => state.auth.auth_token);
  const customerId = useSelector(
    (state: RootState) => state.auth.user?.user_id,
  );

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [pageProperties, setPageProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState<number | null>(null);
  const [selectedPropertyForMap, setSelectedPropertyForMap] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  // ✅ Check if product is in wishlist
  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // ✅ Handle wishlist toggle
  const handleWishlistToggle = async (
    e: React.MouseEvent,
    product: Property,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authToken) {
      toast.error("Please login to add to wishlist");
      return;
    }

    let effectiveCustomerId = customerId;
    if (!effectiveCustomerId) {
      try {
        const profileRes: any = await getUserProfile();
        effectiveCustomerId =
          profileRes?.data?.customer_id ||
          profileRes?.data?.id ||
          profileRes?.customer_id ||
          profileRes?.id ||
          undefined;
      } catch (err) {
        console.warn("Could not fetch profile for wishlist action:", err);
      }
    }

    if (!effectiveCustomerId) {
      toast.error("Please complete your profile before adding to wishlist");
      return;
    }

    setLoadingWishlist(product.id);

    try {
      const inWishlist = isInWishlist(product.id);
      const newStatus = !inWishlist;

      const response = await updateWishlist({
        customer_id: effectiveCustomerId,
        product_id: product.id,
        in_wishlist: newStatus,
      });

      if (response?.status) {
        if (newStatus) {
          dispatch(
            addToWishlist({
              id: product.id,
              name: product.name,
              image_1920: product.image_1920,
              list_price: product.list_price,
              rating: product.rating ?? 0,
              review_count: product.review_count ?? 0,
              slug: product.slug,
              discount_value: product.discount_value,
              amenities: product.amenities ?? [],
              city_name: product.city_name || "",
              address: product.address || "",
            }),
          );
          toast.success("Added to wishlist!");
        } else {
          dispatch(removeFromWishlist(product.id));
          toast.success("Removed from wishlist!");
        }
      } else {
        toast.error(response?.message || "Failed to update wishlist");
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      toast.error(error?.message || "Failed to update wishlist");
    } finally {
      setLoadingWishlist(null);
    }
  };

  // ✅ Fetch city and property type data for mapping
  useEffect(() => {
    async function loadData() {
      try {
        const cityData = await getCityData();
        const propertyData = await getPropertyTypes("en");
        const amenityData = await getAmenities();
        setCities(cityData || []);
        setPropertyTypes(
          Array.isArray(propertyData) ? propertyData : propertyData?.data || [],
        );
        setAmenities(
          Array.isArray(amenityData) ? amenityData : amenityData?.data || [],
        );
      } catch (error) {
        console.error("Failed to load city and property data:", error);
      }
    }
    loadData();
  }, []);

  // ✅ Convert SearchBar values from URL params to FilterState
  useEffect(() => {
    if (!params) return;

    const cityIdStr = params.get("city");
    const typeIdStr = params.get("type");
    const checkinStr = params.get("checkIn");
    const checkoutStr = params.get("checkOut");
    const adultsStr = params.get("adults");
    const childrenStr = params.get("children");
    const roomsStr = params.get("rooms");
    const petsStr = params.get("pets");

    // Convert city ID string to number
    const cityId = cityIdStr ? Number(cityIdStr) : null;

    // Convert type ID string to number array
    const typeIds = typeIdStr ? [Number(typeIdStr)] : [];

    // Convert pets string to boolean
    const pets = petsStr === "true";

    // Update filters if any SearchBar params are present
    if (
      cityIdStr ||
      typeIdStr ||
      checkinStr ||
      checkoutStr ||
      adultsStr ||
      childrenStr ||
      roomsStr ||
      petsStr
    ) {
      setFilters((prev) => ({
        ...prev,
        city: cityId,
        propertyType: typeIds,
        checkIn: checkinStr || "",
        checkOut: checkoutStr || "",
        adults: adultsStr ? Number(adultsStr) : prev.adults,
        children: childrenStr ? Number(childrenStr) : prev.children,
        rooms: roomsStr ? Number(roomsStr) : prev.rooms,
        pets: petsStr ? pets : prev.pets,
      }));
      setPage(1);
    }
  }, [params]);
  const [sortBy, setSortBy] = useState<
    "Sort By" | "price-low" | "price-high" | "rating"
  >("Sort By");

  // Listen for map icon click event
  useEffect(() => {
    const handleShowMap = (event: any) => {
      console.log("Map event triggered:", event.detail);
      const { lat, lng } = event.detail;
      setSelectedPropertyForMap({ lat, lng });

      // Check screen size
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setMobileMapOpen(true);
      }
    };

    window.addEventListener("showPropertyMap", handleShowMap);
    return () => window.removeEventListener("showPropertyMap", handleShowMap);
  }, []);

  // Fetch all properties
  useEffect(() => {
    async function fetchAllProperties() {
      setLoading(true);
      console.log("🏠 Current filters:", filters);
      try {
        const result = await getFilteredProperties({
          ...filters,
          page: 1,
          page_size: 1000,
        });

        console.log("🏠 Properties fetched:", result?.length || 0);

        const mapped = (Array.isArray(result) ? result : [])
          .filter((p: any) => {
            // Client-side filter for rooms (if backend doesn't filter it)
            if (
              filters.rooms &&
              p.no_of_rooms &&
              p.no_of_rooms < filters.rooms
            ) {
              return false;
            }
            return true;
          })
          .map((p: any) => ({
            ...p,
            lat: Number(p.latitude),
            lng: Number(p.longitude),
            title: p.name,
            price: p.list_price,
            image: p.image_1920
              ? `${BASE_URL}${p.image_1920}`
              : "/placeholder.png",
          }));

        setAllProperties(mapped);
        setTotalItems(mapped.length);
      } catch (err) {
        console.error("Filter API error:", err);
      }
      setLoading(false);
    }
    fetchAllProperties();
  }, [filters]);

  // Paginated property list with sorting
  useEffect(() => {
    let sortedProperties = [...allProperties];

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        sortedProperties.sort((a, b) => a.list_price - b.list_price);
        break;
      case "price-high":
        sortedProperties.sort((a, b) => b.list_price - a.list_price);
        break;
      case "rating":
        sortedProperties.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;

      default:
        // Keep original order
        break;
    }

    // Apply pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setPageProperties(sortedProperties.slice(start, end));
  }, [allProperties, page, sortBy]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleCheckProperty = (property: Property) => {
    router.push(`/properties/${property.slug}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ─── MOBILE FILTER MODAL ─── */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-full sm:w-80 bg-white shadow-2xl overflow-y-auto animate-slideInFromLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b  sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  setPage(1);
                  // Clear URL params when filters are applied
                  if (
                    JSON.stringify(newFilters) ===
                    JSON.stringify(defaultFilters)
                  ) {
                    router.push("/properties");
                  }
                }}
                onApplyFilters={() => {
                  // Close mobile filter modal when Apply Filters button is clicked
                  setMobileFilterOpen(false);
                  toast.success("Filters applied!");
                }}
                cities={cities}
                propertyTypes={propertyTypes}
                amenities={amenities}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE MAP MODAL ─── */}
      {mobileMapOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMapOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-full bg-white shadow-2xl overflow-hidden animate-slideInFromRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b  sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">Map View</h3>
              <button
                onClick={() => setMobileMapOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="w-full h-[calc(100vh-80px)]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-slate-600 font-medium">Loading map...</p>
                  </div>
                </div>
              ) : (
                <PropertyMap
                  properties={allProperties}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  // focusLocation={selectedPropertyForMap}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-20">
        {/* SECTION 1: FILTER SIDEBAR - LEFT (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/4  overflow-y-auto mb-10 bg-gradient-to-b from-[#FFFBF1] to-white flex-col">
          <div className="flex-1 p-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1);
                // Clear URL params when filters are reset
                if (
                  JSON.stringify(newFilters) === JSON.stringify(defaultFilters)
                ) {
                  router.push("/properties");
                }
              }}
              cities={cities}
              propertyTypes={propertyTypes}
              amenities={amenities}
            />
          </div>
        </div>

        {/* SECTION 2: PROPERTIES LIST - CENTER */}
        <div className="flex-1 lg:w-1/2 flex flex-col overflow-hidden  ">
          {/* Mobile Controls */}
          <div className="lg:hidden flex flex-col gap-3 p-4 border-b bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex-1"
              >
                <Menu size={20} className="text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Filters
                </span>
              </button>
              <button
                onClick={() => setMobileMapOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex-1"
              >
                <Map size={20} className="text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Map
                </span>
              </button>
            </div>

            {/* Sort Dropdown - Mobile */}
            <div className="px-2">
              <label className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg font-medium text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c755b] focus:border-transparent transition-all cursor-pointer flex-1"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </label>
            </div>
          </div>

          {/* Properties Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFFBF1] mb-4">
                    <div className="w-6 h-6 rounded-full border-2 border-[#FFFBF1] border-t-black animate-spin"></div>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Loading properties...
                  </p>
                </div>
              </div>
            ) : pageProperties.length === 0 ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-slate-600 font-medium text-lg mb-2">
                    No properties found
                  </p>
                  <p className="text-slate-500 text-sm">
                    Try adjusting your filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  {pageProperties.map((p) => (
                    <PropertyRowCard
                      key={p.id}
                      property={p}
                      isHovered={hoveredId === p.id}
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onCheck={() => handleCheckProperty(p)}
                      loadingWishlist={loadingWishlist}
                      handleWishlistToggle={handleWishlistToggle}
                      isInWishlist={isInWishlist}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sticky bottom-0 bg-white   px-4 lg:px-6 py-4 flex items-center justify-center gap-2 overflow-x-auto mb-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border  bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const num = page <= 3 ? i + 1 : page + i - 2;
                  if (num > totalPages) return null;
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
                        page === num
                          ? "bg-gradient-to-r from-[#C2A68C] to-[#C2A68C] text-white shadow-lg"
                          : "border  bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {num}
                    </button>
                  );
                }).filter(Boolean)}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border  bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* SECTION 3: MAP - RIGHT (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/4 flex-col   mr-5 overflow-hidden">
          {/* Sort Dropdown
          
          {/* Sort Dropdown */}
          <div className="px-4 py-4 bg-white border-b  flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 bg-[#FFFBF1] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c755b] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="sort-by">Sort By</option>
              {/* <option value="relevance">Relevance</option> */}
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Map Content */}
          {/* <div className="flex-1 overflow-hidden md:mb-5"> */}
          <div className="h-[calc(178vh-5rem)] sticky top-20 overflow-hidden">
            {loading ? (
              <div className="w-full h-[1500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full  mb-2">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-200  animate-spin"></div>
                  </div>
                  <p className="text-slate-600 font-medium">Loading map...</p>
                </div>
              </div>
            ) : (
              <PropertyMap
                properties={allProperties}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                // focusLocation={selectedPropertyForMap}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.3s ease-out;
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// ─── Property Row Card (Responsive for Mobile & Desktop) ─────────────────────

function PropertyRowCard({
  property: p,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onCheck,
  loadingWishlist,
  handleWishlistToggle,
  isInWishlist,
}: {
  property: Property;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCheck: () => void;
  loadingWishlist: number | null;
  handleWishlistToggle: (
    e: React.MouseEvent,
    product: Property,
  ) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}) {
  const nightLabel =
    p.night_count && p.night_count > 1 ? `${p.night_count} nights` : "1 night";

  // Handle map button click
  const handleMapClick = () => {
    console.log("Map button clicked for property:", {
      id: p.id,
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
    });

    const event = new CustomEvent("showPropertyMap", {
      detail: {
        propertyId: p.id,
        lat: Number(p.latitude),
        lng: Number(p.longitude),
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group bg-white rounded-xl overflow-hidden border transition-all duration-300 flex flex-col lg:flex-row lg:items-stretch ${
        isHovered
          ? "shadow-2xl ring-2 ring-grey border-grey"
          : "shadow-md hover:shadow-lg "
      }`}
    >
      {/* Image - Top on Mobile, Left on Desktop */}
      <div className="w-full lg:w-80 lg:min-w-[250px] h-56 lg:h-80 relative overflow-hidden bg-slate-100">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Information - Stacked on Mobile, Horizontal on Desktop */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        {/* Left Info */}
        <div className="flex-1">
          <h3 className=" text-slate-900 text-xl lg:text-2xl line-clamp-2 group-hover:text-grey transition mb-3 lg:mb-4">
            {p.name}
          </h3>

          <div className="flex items-center gap-2 mb-4 lg:mb-5">
            <MapPin
              size={18}
              className="text-black flex-shrink-0 hidden lg:block lg:w-[28px] lg:h-[28px]"
            />
            <MapPin size={18} className="text-black flex-shrink-0 lg:hidden" />
            <p className="text-base lg:text-xl text-black font-medium">
              {p.city_name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            {/* FOOD */}
            {p.is_food_available && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#E9DCCF] text-[#7A5C3E] rounded-full text-sm font-medium">
                <UtensilsCrossed size={16} />
                Food Available
              </div>
            )}

            {/* ROOMS */}
            {p.no_of_rooms && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                <Home size={16} />
                {p.no_of_rooms} Rooms
              </div>
            )}

            {/* GUESTS */}
            {p.no_of_guest && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                <Users size={16} />
                {p.no_of_guest} Guests
              </div>
            )}

            {/* PETS */}
            {p.is_pets_allowed && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                <PawPrint size={16} />
                Allows Pets
              </div>
            )}
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
            <div className="backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1 shadow-md">
              <Star
                size={16}
                className="fill-amber-400 text-amber-400 flex-shrink-0 hidden lg:block lg:w-[17px] lg:h-[17px]"
              />
              <Star
                size={16}
                className="fill-amber-400 text-amber-400 flex-shrink-0 lg:hidden"
              />
              <span className="text-base lg:text-lg text-slate-900 font-semibold">
                {Number(p.rating || 0).toFixed(1)}
              </span>
            </div>

            <p className="text-base lg:text-lg text-black font-medium">
              {p.review_count || 0} reviews
            </p>
          </div>
        </div>

        {/* Right Side - Price & Actions (Stacked on Mobile) */}
        <div className="flex flex-col lg:flex-col items-start lg:items-end gap-3 lg:ml-4 w-full lg:w-auto">
          {/* Action Buttons */}
          <div className="flex gap-2 w-[40px] lg:w-auto">
            <button
              onClick={handleMapClick}
              className="flex-1 lg:flex-none p-2 bg-slate-100 hover:bg-blue-100 rounded-lg transition"
              title="View on Map"
            >
              <MapPin
                size={18}
                className="text-slate-600 hover:text-blue-600"
              />
            </button>
            <button
              onClick={(e) => handleWishlistToggle(e, p)}
              disabled={loadingWishlist === p.id}
              className="flex-1 lg:flex-none p-2 bg-slate-100 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
            >
              <Heart
                size={18}
                className={`${
                  isInWishlist(p.id)
                    ? "text-red-600 fill-current"
                    : "text-slate-600 hover:text-red-600"
                }`}
              />
            </button>
          </div>

          {/* Price */}
          <div className="text-left lg:text-right w-full">
            <p className="text-sm lg:text-lg text-black font-medium">
              Starting From
            </p>
            <p className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">
              SAR {Number(p.list_price).toLocaleString()}
            </p>
            <p className="text-sm lg:text-lg text-black font-medium">
              {nightLabel}
            </p>
          </div>

          {/* Check Button */}
          <button
            onClick={onCheck}
            className="w-full lg:w-auto bg-[#C2A68C] text-white text-base lg:text-lg font-bold px-6 lg:px-10 py-3 lg:py-3 rounded-lg transition shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center lg:justify-start gap-2 active:scale-95"
          >
            <Calendar
              size={20}
              className="text-white hidden lg:block lg:w-[28px] lg:h-[28px]"
            />
            <Calendar size={20} className="text-white lg:hidden" />
            <span>Check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
