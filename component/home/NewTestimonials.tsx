"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Mousewheel,
  Navigation,
  EffectCreative,
} from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";

import Heading2 from "../reusable/Heading2";
import ContainerSection from "../reusable/ContainerSection";
import { FeedbackSection } from "@/types/home/sectionDataTypes";

type Props = {
  sectionData: FeedbackSection;
};

export default function NewTestimonials({ sectionData }: Props) {
  const testimonials = sectionData.sub_sections;

  // Desktop: group 2 cards per slide
  const groupedDesktop = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    groupedDesktop.push(testimonials.slice(i, i + 2));
  }

  return (
    <ContainerSection>
      <Heading2 className="mb-10">{sectionData.heading}</Heading2>

      {/* MOBILE SWIPER */}
      <div className="block md:hidden">
        <Swiper
          direction="vertical"
          loop={true}
          mousewheel={true}
          //   navigation={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={500}
          spaceBetween={16}
          slidesPerView={1.5} // 1 full + half peek
          slidesPerGroup={1}
          className="h-[370px]" // 1.5 card heights
        >
          {testimonials.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex bg-white rounded-2xl  overflow-hidden h-[240px]">
                {/* Left image */}
                <div className="relative w-2/5 h-full ">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}?v=${Date.now()}`}
                    alt={item.name}
                    fill
                    className="object-cover border border-(--primaryColor) rounded-2xl shadow-xl "
                  />
                </div>

                {/* Right content */}
                <div className="w-3/5 p-4 flex flex-col justify-between shadow-md rounded-2xl border">
                  <div>
                    <p className="text-md font-medium text-gray-900 line-clamp-2">
                      {item.heading}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                      {item.sub_heading}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <div className="flex mt-1 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* DESKTOP SWIPER */}
      <div className="hidden md:block">
        <Swiper
          direction="vertical"
          loop={true}
          speed={1000}
          spaceBetween={24}
          slidesPerView={1} // 1.5 rows: full + half peek
          slidesPerGroup={1}
          className="h-[300px]" // adjust to show 2 full + half
          modules={[Autoplay, Mousewheel, Navigation, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: {
              translate: [0, "-20%", -200],
              // rotate: [16, 0, 0],
              // scale: 0.95,
              opacity: 0, // 👈 fully hidden when going back
            },
            next: {
              translate: [0, "20%", -200],
              // rotate: [-16, 0, 0],
              // scale: 0.95,
              opacity: 0, // 👈 fully hidden when going back
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.3,
          }}
        >
          {groupedDesktop.map((group, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex gap-6 items-center">
                {group.map((item, i) => (
                  <div
                    key={i}
                    className="flex bg-white rounded-2xl gap-2 overflow-hidden h-[260px] w-1/2"
                  >
                    {/* Left image */}
                    <div className="relative w-2/5 h-full ">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}?v=${Date.now()}`}
                        alt={item.name}
                        fill
                        className="object-cover border border-(--primaryColor) rounded-2xl shadow-md "
                      />
                    </div>

                    {/* Right content */}
                    <div className="w-3/5 p-5 flex flex-col justify-between shadow-md rounded-2xl border">
                      <div>
                        <p className="text-md md:text-xl font-medium text-gray-900 line-clamp-2">
                          {item.heading}
                        </p>
                        <p className="text-sm md:text-lg text-gray-600 mt-1 line-clamp-3">
                          {item.sub_heading}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm md:text-lg font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm md:text-md text-gray-500">
                          {item.description}
                        </p>
                        <div className="flex mt-1 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {group.length === 1 && <div className="w-1/2" />}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </ContainerSection>
  );
}
