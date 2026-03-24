// "use client";

// import { useEffect, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { EffectCoverflow, Navigation, Pagination, Zoom } from "swiper/modules";
// import Image from "next/image";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";
// import PropertyVideo from "./PropertyVideo";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/zoom";

// interface Slide {
//   type: "image" | "video";
//   url: string;
//   category?: string;
// }

// interface Props {
//   slides: Slide[];
//   initialSlide?: number;
//   onClose: () => void;
//   category?: string; // optional category label
//   setActiveCategory?: (cat: string) => void;
// }

// export default function GallerySlider({
//   slides,
//   initialSlide = 0,
//   onClose,
//   category,
//   setActiveCategory
// }: Props) {
//   const prevRef = useRef<HTMLDivElement>(null);
//   const nextRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 z-50 w-full h-full bg-black/95 flex items-center justify-center">
//       {/* Close button */}
//       <button
//         onClick={onClose}
//         className="fixed top-6 right-6 z-50 p-1 rounded-full bg-white hover:bg-gray-100 close-button"
//       >
//         <X size={24} className="text-(--primaryColor)" />
//       </button>

//       {/* Navigation Arrows */}
//       <div
//         ref={prevRef}
//         className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg cursor-pointer hover:bg-gray-200"
//       >
//         <ChevronLeft size={28} className="text-[#82604d]" />
//       </div>
//       <div
//         ref={nextRef}
//         className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg cursor-pointer hover:bg-gray-200"
//       >
//         <ChevronRight size={28} className="text-[#82604d]" />
//       </div>

//       {/* Swiper Container */}
//       <div
//         className="w-full max-w-6xl px-4 md:px-8 h-full flex items-center justify-center relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Category Label */}
//         {category && (
//           <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-1 bg-black/50 text-white rounded-lg font-medium">
//             {category}
//           </div>
//         )}

//         <Swiper
//           modules={[Navigation, Pagination, Zoom, EffectCoverflow]}
//           effect="coverflow"
//           grabCursor={true}
//           navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
//           pagination={{
//             type: "fraction",
//             renderFraction: (currentClass, totalClass) =>
//               `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`,
//           }}
//           zoom
//           coverflowEffect={{
//             rotate: 30,
//             stretch: 0,
//             depth: 200,
//             modifier: 1,
//             slideShadows: true,
//           }}
//           spaceBetween={20}
//           initialSlide={initialSlide}
//           onSlideChange={(swiper) => {
//             const currentSlide = slides[swiper.activeIndex];
//             if (currentSlide?.category && setActiveCategory) {
//               setActiveCategory(currentSlide.category);
//             }
//           }}
//           onSwiper={(swiper) => {
//             setTimeout(() => {
//               if (swiper.params.navigation) {
//                 // @ts-ignore
//                 swiper.params.navigation.prevEl = prevRef.current;
//                 // @ts-ignore
//                 swiper.params.navigation.nextEl = nextRef.current;
//                 swiper.navigation.destroy();
//                 swiper.navigation.init();
//                 swiper.navigation.update();
//               }
//             });
//           }}
//           className="h-full"
//         >
//           {slides.map((slide, i) => (
//             <SwiperSlide key={i} data-category={slide.category || "All Media"}>
//               <div className="relative w-full h-[90vh] rounded-xl overflow-hidden bg-black flex items-center justify-center">
//                 {slide.type === "image" ? (
//                   <div className="swiper-zoom-container w-full h-full">
//                     <Image
//                       src={slide.url}
//                       alt={`Slide ${i + 1}`}
//                       fill
//                       className="object-contain"
//                     />
//                   </div>
//                 ) : (
//                   <PropertyVideo
//                     videoUrl={slide.url}
//                     title={`Video ${i + 1}`}
//                     autoPlay={false}
//                   />
//                 )}
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <style jsx>{`
//         .close-button {
//           border: 2px solid #82604d;
//           color: #82604d;
//           transition: all 0.2s;
//         }
//         .close-button:hover {
//           background: #82604d;
//           color: #fff;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";

interface Props {
  slides: { url: string; type: "image" | "video"; category: string }[];
  initialSlide?: number;
  onClose: () => void;
  category: string;
  setActiveCategory: (cat: string) => void;
}

export default function GallerySlider({
  slides,
  initialSlide = 0,
  onClose,
  category,
}: Props) {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (swiperInstance?.params?.navigation) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-5xl h-[80vh]">
        {/* Category Label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-1 bg-black/60 text-white rounded-md text-sm font-medium">
          {category}
        </div>
        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiperInstance}
          initialSlide={initialSlide}
          slidesPerView={1}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[80vh] flex items-center justify-center bg-black">
                {slide.type === "image" ? (
                  <Image
                    src={slide.url}
                    alt={`Slide ${i + 1}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <video
                    src={slide.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <div
          ref={prevRef}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-50 cursor-pointer text-white text-4xl select-none"
        >
          ‹
        </div>
        <div
          ref={nextRef}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 cursor-pointer text-white text-4xl select-none"
        >
          ›
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 text-white text-3xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
