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
