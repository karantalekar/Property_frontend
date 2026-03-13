"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import {
  Star,
  Heart,
  ArrowRight,
  //   ChevronLeft,
  //   ChevronRight,
} from "lucide-react";

import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function TrendingProperties({ data }: { data: any }) {
  const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

  return (
    <div className=" py-20">
      {/* 1. HEADING OUTSIDE OF SECTION (Max-width container) */}
      <div className=" mx-auto px-6 mb-5">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl  text-gray-900 tracking-tight">
              Trending Properties
            </h2>
            <p className="text-gray-500 mt-3 text-lg font-medium">
              Explore our most popular stays curated just for you
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* VIEW MORE BUTTON ON TOP */}
            <button className="hidden w-75 md:block bg-[#8B6D5C] text-white px-8 py-3.5 rounded-xl font-medium text-xl hover:bg-[#ffffff] hover:text-black transition-all shadow-lg shadow-amber-900/20">
              View More
            </button>
          </div>
        </div>
      </div>

      {/* 2. AUTO-SCROLL SECTION */}
      <div className="w-full">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1.2} // Shows partial next card on mobile
          grabCursor={true}
          loop={true} // Continuous loop
          freeMode={true} // Smoother manual movement
          navigation={{
            nextEl: ".swiper-next-btn",
            prevEl: ".swiper-prev-btn",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 }, // EXACTLY 4 CARDS AT A TIME
          }}
          className="!overflow-visible px-6"
        >
          {data?.map((item) => (
            <SwiperSlide key={item.id} className="pb-5">
              <Link href={`/properties/${item.slug}`}>
                {/* LARGE CARD DESIGN */}
                <div className="group bg-white rounded-[3rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(139,109,92,0.2)] transition-all duration-500 border border-gray-50 ">
                  {/* Image Wrapper */}
                  <div className="relative h-[350px] overflow-hidden rounded-[2.5rem] mb-2">
                    <img
                      src={`${BASE_URL}${item.image_1920}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {/* Discount Badge */}
                    {item.discount_value && (
                      <div className="absolute top-5 left-5">
                        <span className="bg-[#FFD700] text-black text-[11px] font-black px-4 py-2 rounded-xl shadow-md uppercase tracking-wider">
                          {item.discount_value}% Off
                        </span>
                      </div>
                    )}

                    <button className="absolute top-5 right-5 p-3.5 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-2">
                    {/* Amenities */}
                    <div className="flex gap-2.5 mb-3">
                      {item.amenities?.slice(0, 4).map((amt) => (
                        <div
                          key={amt.id}
                          className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center p-2 border border-amber-50/50"
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
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star
                        size={16}
                        className="fill-[#FFD700] text-[#FFD700]"
                      />
                      <span className="text-sm font-bold text-gray-800">
                        {item.rating}
                      </span>
                      <span className="text-sm text-gray-400 font-medium ml-1">
                        ({item.review_count} Reviews)
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-[#8B6D5C] transition-colors">
                      {item.name}
                    </h3>

                    {/* Price Footer */}
                    <div className="flex justify-between items-center border-t border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                          Price starting at
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-gray-900">
                            {item.list_price}
                          </span>
                          <span className="text-xs text-gray-500 font-bold tracking-tight">
                            SAR / {item.night_count} night
                          </span>
                        </div>
                      </div>

                      <button className="bg-[#8B6D5C] p-3 rounded-2xl text-white shadow-lg shadow-amber-900/20 hover:bg-[#765c4e] transition-all">
                        <ArrowRight size={25} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Mobile View More Button (only shows on small screens) */}
        <div className="md:hidden px-6 mt-8">
          <button className="w-full bg-[#8B6D5C] text-white py-4 rounded-2xl font-bold">
            View More
          </button>
        </div>
      </div>
    </div>
  );
}
