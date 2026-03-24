
"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Star, Heart, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Link from "next/link";
import { RootState } from "@/redux/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/Wishlistslice";
import { updateWishlist } from "@/API/Wishlist";
import { getUserProfile } from "@/API/profile";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function TrendingProperties({ data }: { data: any }) {
  const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";
  const dispatch = useDispatch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [loadingWishlist, setLoadingWishlist] = useState<number | null>(null);
  const swiperRef = useRef<any>(null);

  // Redux selectors
  const wishlistItems = useSelector(
    (state: RootState) =>
      // `wishlist` reducer may be absent from the store; guard against undefined
      state.wishlist?.items ?? [],
  );
  const authToken = useSelector((state: RootState) => state.auth.auth_token);
  const customerId = useSelector(
    (state: RootState) => state.auth.user?.user_id,
  );
  // Keep previous behavior: fall back to customer_id = 10 when missing

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.realIndex);
  };

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideToLoop?.(index);
  };

  const handleSwiperInit = (swiper: any) => {
    setTotalSlides(swiper.slides.length);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authToken) {
      toast.error("Please login to add to wishlist");
      return;
    }

    // Try to use the real customer_id. If missing, attempt to fetch profile from API.
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

        // Optionally update local Redux auth user (best-effort)
        if (effectiveCustomerId) {
          // Avoid TypeScript strictness; runtime update only
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dispatch({
              type: "auth/updateUser",
              payload: { customer_id: effectiveCustomerId },
            });
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.warn("Could not fetch profile for wishlist action:", err);
      }
    }

    if (!effectiveCustomerId) {
      toast.error("Please complete your profile before adding to wishlist");
      setLoadingWishlist(null);
      return;
    }

    setLoadingWishlist(product.id);

    try {
      const inWishlist = isInWishlist(product.id);
      const newStatus = !inWishlist;

      // Call API to update wishlist
      const response = await updateWishlist({
        customer_id: effectiveCustomerId,
        product_id: product.id,
        in_wishlist: newStatus,
      });

      if (response?.status) {
        if (newStatus) {
          // Add to Redux wishlist
          dispatch(
            addToWishlist({
              id: product.id,
              name: product.name,
              image_1920: product.image_1920,
              list_price: product.list_price,
              rating: product.rating,
              review_count: product.review_count,
              slug: product.slug,
              discount_value: product.discount_value,
              amenities: product.amenities,
              city_name: product.city_name,
              address: product.address,
            }),
          );
          toast.success("Added to wishlist!");
        } else {
          // Remove from Redux wishlist
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

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 lg:px-0 ">
        {/* HEADING SECTION */}
        <div className="py-12 md:py-15">
          <div className="flex flex-row justify-between items-center gap-4 md:gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 whitespace-nowrap">
              Trending
              <br className="md:hidden" />
              <span className="md:hidden"> </span> Properties
            </h2>

            {/* VIEW MORE BUTTON */}
            <Link href="/properties/">
              <button className="bg-[#8B6D5C] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-medium text-sm sm:text-base md:text-lg hover:bg-white hover:text-black transition-all shadow-lg shadow-amber-900/20 whitespace-nowrap flex-shrink-0">
                View More
              </button>
            </Link>
          </div>
        </div>

        {/* CAROUSEL SECTION - All inside container */}
        <div className="relative w-full overflow-hidden md:-mt-15 -mt-8">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            spaceBetween={15}
            slidesPerView={1}
            grabCursor={true}
            loop={true}
            onSlideChange={handleSlideChange}
            onInit={handleSwiperInit}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 25 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1440: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="w-full"
          >
            {data?.map((item: any) => (
              <SwiperSlide key={item.id} className="pb-5">
                <Link href={`/properties/${item.slug}`}>
                  <div>
                    {/* CARD DESIGN */}
                    <div className="group bg-white rounded-xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(139,109,92,0.2)] transition-all duration-500 border border-gray-50 h-full">
                      {/* Image Wrapper */}
                      <div className="relative h-[220px] sm:h-[280px] md:h-[350px] overflow-hidden rounded-xl mb-3 md:mb-4">
                        <img
                          src={`${BASE_URL}${item.image_1920}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />

                        {/* Discount Badge */}
                        {item.discount_value && (
                          <div className="absolute top-2 sm:top-3 md:top-5 left-2 sm:left-3 md:left-5">
                            <span className="bg-[#FFD700] text-black text-[9px] sm:text-[10px] md:text-[11px] font-black px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 rounded shadow-md uppercase tracking-wider">
                              {item.discount_value}% Off
                            </span>
                          </div>
                        )}

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => handleWishlistToggle(e, item)}
                          disabled={loadingWishlist === item.id}
                          className="absolute top-2 sm:top-3 md:top-5 right-2 sm:right-3 md:right-5 z-10"
                        >
                          <div
                            className={`p-2 sm:p-2.5 md:p-3.5 bg-white/90 backdrop-blur-md rounded-full ${
                              isInWishlist(item.id)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            } shadow-sm transition-all hover:bg-white disabled:opacity-50 ${
                              loadingWishlist === item.id ? "opacity-50" : ""
                            }`}
                          >
                            <Heart
                              size={16}
                              className={`sm:w-5 sm:h-5 md:w-5 md:h-5 ${
                                isInWishlist(item.id) ? "fill-current" : ""
                              }`}
                            />
                          </div>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="px-1 sm:px-2 flex flex-col h-full">
                        {/* Amenities */}
                        <div className="flex gap-2 sm:gap-2.5 mb-3">
                          {item.amenities?.slice(0, 4).map((amt: any) => (
                            <div
                              key={amt.id}
                              className="w-8 sm:w-10 h-8 sm:h-10 bg-[#FAF8F5] rounded flex items-center justify-center p-1.5 sm:p-2 border border-amber-50/50"
                            >
                              <img
                                src={`${BASE_URL}${amt.image}`}
                                className="w-full h-full opacity-60"
                                alt=""
                              />
                            </div>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                          <Star
                            size={14}
                            className="sm:w-4 sm:h-4 fill-[#FFD700] text-[#FFD700]"
                          />
                          <span className="text-xs sm:text-sm font-bold text-gray-800">
                            {item.rating}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
                            ({item.review_count} Reviews)
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#8B6D5C] transition-colors">
                          {item.name}
                        </h3>

                        {/* Price Footer */}
                        <div className="flex justify-between items-center gap-2 sm:gap-3 border-t border-gray-100 pt-2 sm:pt-3 mt-auto">
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                              Price starting at
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 truncate">
                                {item.list_price}
                              </span>
                              <span className="text-[8px] sm:text-xs text-gray-500 font-bold tracking-tight whitespace-nowrap">
                                SAR / {item.night_count} night
                              </span>
                            </div>
                          </div>

                          <button className="bg-[#8B6D5C] p-2 sm:p-3 md:p-3.5 rounded-lg sm:rounded-2xl text-white shadow-lg shadow-amber-900/20 hover:bg-[#765c4e] transition-all flex-shrink-0">
                            <ArrowRight
                              size={18}
                              className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DOT NAVIGATION - Inside container */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-3 md:mt-4 pb-8 md:pb-10">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "bg-[#8B6D5C] w-3 h-3"
                    : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
