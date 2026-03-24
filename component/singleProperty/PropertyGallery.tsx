// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper/modules";
// import { Images, Video } from "lucide-react";
// import { translations } from "@/i18n/translations";
// import GallerySliderModal from "./GallerySliderModal";
// import GallerySlider from "./GallerySlider";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// interface Props {
//   image_1920?: string;
//   lang: "en" | "ar";
//   review_count?: number;
//   rating?: number;
//   fullGallery?: Record<string, { images: string[]; videos: string[] }>;
// }

// // ✅ Helper to ensure full URLs
// const fixUrl = (url?: string, fallback?: string) => {
//   if (!url) return fallback || "/placeholder.jpg";
//   if (url.startsWith("http")) return url;
//   return `${process.env.NEXT_PUBLIC_BASE_URL || "https://beljumlah-11072023-28562543.dev.odoo.com"}${url}`;
// };

// type GalleryItem =
//   | { url: string; isVideo: false; category: string }
//   | { url: string; isVideo: true; thumbnail: string; category: string };

// export default function PropertyGallery({
//   image_1920,
//   lang,
//   review_count,
//   rating,
//   fullGallery,
// }: Props) {
//   if (!fullGallery || Object.keys(fullGallery).length === 0) return null;

//   const firstCategory = Object.keys(fullGallery)[0];
//   const [activeCategory, setActiveCategory] = useState<string>(firstCategory);
//   const [openGalleryIndex, setOpenGalleryIndex] = useState<number | null>(null);
//   const [sliderOpen, setSliderOpen] = useState(false);
//   const [sliderStartIndex, setSliderStartIndex] = useState(0);

//   const t = translations[lang];
//   const MAX_SLOTS = 5;

//   // Build gallery items for active category only
//   const galleryItems: GalleryItem[] = [
//     ...(fullGallery[activeCategory]?.images?.map((url) => ({
//       url: fixUrl(url, image_1920),
//       isVideo: false,
//       category: activeCategory,
//     })) || []),
//     ...(fullGallery[activeCategory]?.videos?.map((url) => ({
//       url: fixUrl(url, ""),
//       isVideo: true,
//       thumbnail: fixUrl(fullGallery[activeCategory]?.images?.[0], image_1920),
//       category: activeCategory,
//     })) || []),
//   ];

//   if (galleryItems.length === 0) {
//     return (
//       <div className="w-full h-64 bg-gray-200 flex items-center justify-center mt-6">
//         <span className="text-gray-500">{t.noMediaAvailable}</span>
//       </div>
//     );
//   }

//   const visibleItems = galleryItems.slice(0, MAX_SLOTS);
//   const handleItemClick = (index: number) => {
//     setSliderStartIndex(index);
//     setSliderOpen(true);
//   };

//   return (
//     <>
//       {/* Category Tabs */}
//       <div className="flex gap-2 flex-wrap mt-4">
//         {Object.keys(fullGallery).map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActiveCategory(cat)}
//             className={`px-4 py-2 rounded-full text-sm font-medium border ${
//               activeCategory === cat
//                 ? "bg-[#8b6a55] text-white border-transparent"
//                 : "bg-white text-gray-700 border-gray-300"
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Desktop Grid */}
//       <div className="hidden md:grid grid-cols-4 gap-2 h-[440px] mt-4">
//         {visibleItems.map((item, i) => (
//           <div
//             key={i}
//             className={
//               i === 0
//                 ? "relative md:col-span-2 md:row-span-2 h-full cursor-pointer"
//                 : "relative h-[215px] cursor-pointer"
//             }
//             onClick={() => handleItemClick(i)}
//           >
//             <Image
//               src={item.isVideo ? item.thumbnail : item.url}
//               alt={item.isVideo ? "Property Video" : `Image ${i + 1}`}
//               fill
//               className="object-cover"
//             />
//             {item.isVideo && (
//               <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
//                 <Video className="h-12 w-12" />
//                 <span className="ml-2 text-sm">
//                   {t.watchVideo || "Watch Video"}
//                 </span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Mobile Swiper */}
//       <div className="md:hidden mt-4">
//         <Swiper
//           modules={[Pagination, Navigation]}
//           spaceBetween={10}
//           slidesPerView={1.5}
//           slidesPerGroup={1}
//           pagination={{
//             clickable: true,
//             type: "fraction",
//             renderFraction: (currentClass, totalClass) =>
//               `<div class="text-black text-sm"><span class="${currentClass}"></span>/<span class="${totalClass}"></span></div>`,
//           }}
//           navigation
//           breakpoints={{
//             0: { slidesPerView: 1.2, slidesPerGroup: 1 },
//             480: { slidesPerView: 1.5, slidesPerGroup: 1 },
//             640: { slidesPerView: 2, slidesPerGroup: 2 },
//           }}
//           className="property-gallery-swiper"
//         >
//           {galleryItems.map((item, i) => (
//             <SwiperSlide key={i}>
//               <div
//                 className="relative h-60 overflow-hidden cursor-pointer"
//                 onClick={() => handleItemClick(i)}
//               >
//                 <Image
//                   src={item.isVideo ? item.thumbnail : item.url}
//                   alt={item.isVideo ? "Property Video" : `Image ${i + 1}`}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Modals */}
//       {openGalleryIndex !== null && (
//         <GallerySliderModal
//           categories={fullGallery}
//           activeCategory={activeCategory}
//           setActiveCategory={setActiveCategory}
//           onClose={() => setOpenGalleryIndex(null)}
//         />
//       )}

//       {sliderOpen && (
//         <GallerySlider
//           slides={galleryItems.map((item) => ({
//             type: item.isVideo ? "video" : "image",
//             url: item.url,
//             category: item.category,
//           }))}
//           initialSlide={sliderStartIndex}
//           onClose={() => setSliderOpen(false)}
//           category={activeCategory}
//           setActiveCategory={setActiveCategory}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Images, Video } from "lucide-react";
import { translations } from "@/i18n/translations";
import GallerySliderModal from "./GallerySliderModal";
import GallerySlider from "./GallerySlider";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Props {
  image_1920?: string;
  lang: "en" | "ar";
  review_count?: number;
  rating?: number;
  fullGallery?: Record<string, { images: string[]; videos: string[] }>;
}

// ✅ Helper to ensure full URLs
const fixUrl = (url?: string, fallback?: string) => {
  if (!url) return fallback || "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_BASE_URL || "https://beljumlah-11072023-28562543.dev.odoo.com"}${url}`;
};

type GalleryItem =
  | { url: string; isVideo: false; category: string }
  | { url: string; isVideo: true; thumbnail: string; category: string };

export default function PropertyGallery({
  image_1920,
  lang,
  review_count,
  rating,
  fullGallery,
}: Props) {
  if (!fullGallery || Object.keys(fullGallery).length === 0) return null;

  const firstCategory = Object.keys(fullGallery)[0];
  const [activeCategory, setActiveCategory] = useState<string>(firstCategory);
  const [openGalleryIndex, setOpenGalleryIndex] = useState<number | null>(null);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderStartIndex, setSliderStartIndex] = useState(0);

  const t = translations[lang];
  const MAX_SLOTS = 5;

  // Build gallery items for active category only
  const galleryItems: GalleryItem[] = [
    ...(fullGallery[activeCategory]?.images?.map((url) => ({
      url: fixUrl(url, image_1920),
      isVideo: false as const,
      category: activeCategory,
    })) || []),
    ...(fullGallery[activeCategory]?.videos?.map((url) => ({
      url: fixUrl(url, ""),
      isVideo: true as const,
      thumbnail: fixUrl(fullGallery[activeCategory]?.images?.[0], image_1920),
      category: activeCategory,
    })) || []),
  ];

  if (galleryItems.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center mt-6">
        <span className="text-gray-500">{t.noMediaAvailable}</span>
      </div>
    );
  }

  const visibleItems = galleryItems.slice(0, MAX_SLOTS);
  const handleItemClick = (index: number) => {
    setSliderStartIndex(index);
    setSliderOpen(true);
  };

  return (
    <>
      {/* Desktop Category Tabs */}
      <div className="hidden md:flex gap-2 flex-wrap mt-4">
        {Object.keys(fullGallery).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeCategory === cat
                ? "bg-[#8b6a55] text-white border-transparent"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 gap-2 h-[440px] mt-4">
        {visibleItems.map((item, i) => (
          <div
            key={i}
            className={
              i === 0
                ? "relative md:col-span-2 md:row-span-2 h-full cursor-pointer"
                : "relative h-[215px] cursor-pointer"
            }
            onClick={() => handleItemClick(i)}
          >
            <Image
              src={item.isVideo ? item.thumbnail : item.url}
              alt={item.isVideo ? "Property Video" : `Image ${i + 1}`}
              fill
              className="object-cover"
            />
            {item.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
                <Video className="h-12 w-12" />
                <span className="ml-2 text-sm">
                  {t.watchVideo || "Watch Video"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Swiper with inline category + pagination */}
      <div className="md:hidden mt-4">
        <div className="flex justify-between items-center mb-2 overflow-x-auto gap-2">
          {/* Category Buttons */}
          <div className="flex gap-2">
            {Object.keys(fullGallery).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${
                  activeCategory === cat
                    ? "bg-[#8b6a55] text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Swiper Fraction */}
          <div className="text-sm text-gray-800 font-medium">
            {galleryItems.length > 0 && `1/${galleryItems.length}`}
          </div>
        </div>

        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={10}
          slidesPerView={1.2}
          slidesPerGroup={1}
          pagination={{ clickable: true }}
          navigation
          className="property-gallery-swiper"
        >
          {galleryItems.map((item, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative h-60 overflow-hidden cursor-pointer"
                onClick={() => handleItemClick(i)}
              >
                <Image
                  src={item.isVideo ? item.thumbnail : item.url}
                  alt={item.isVideo ? "Property Video" : `Image ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modals */}
      {openGalleryIndex !== null && (
        <GallerySliderModal
          categories={fullGallery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onClose={() => setOpenGalleryIndex(null)}
        />
      )}

      {sliderOpen && (
        <GallerySlider
          slides={galleryItems.map((item) => ({
            type: item.isVideo ? "video" : "image",
            url: item.url,
            category: item.category,
          }))}
          initialSlide={sliderStartIndex}
          onClose={() => setSliderOpen(false)}
          category={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}
    </>
  );
}
