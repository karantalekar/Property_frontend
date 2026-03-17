"use client";
import Image from "next/image";
import ContainerSection from "../reusable/ContainerSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { GallerySectionTypes } from "@/types/home/sectionDataTypes";
// import type { GallerySection } from "@/types/home/sectionDataTypes";

type Props = {
  sectionData: GallerySectionTypes;
};
export default function GallerySection({ sectionData }: Props) {
  return (
    <ContainerSection className="h-full lg:my-20 ">
      <div className="relative  w-full ">
        <div className="absolute inset-0 hidden lg:grid lg:grid-cols-5 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => {
            if (i === 4) return null;
            const translateY = [-2, 6, -2, 6, 0][i % 5];

            return (
              <div
                key={i}
                className="relative flex sm:justify-center lg:justify-end"
                style={{ transform: `translateY(${translateY}%)` }}
              >
                <span className="absolute top-[-20%] bottom-[-20%] w-px bg-(--primaryColor)" />
              </div>
            );
          })}
        </div>

        <div className="relative hidden lg:grid lg:grid-cols-5  my-6 z-10">
          {sectionData.sub_sections.map((item, index) => {
            const translateY = [-10, 10, -10, 10, -10][index % 5];
            return (
              <div
                key={item.id}
                className=" overflow-hidden bg-white"
                style={{ transform: `translateY(${translateY}%)` }}
              >
                <div className="relative w-full aspect-3/5">
                  <Image
                    fill
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}?v=${Date.now()}`}
                    alt="Gallery Image"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE */}
        {/* MOBILE – Swiper */}
        <div className="lg:hidden w-full ">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1.2}
            spaceBetween={16}
            centeredSlides
            // pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="gallery-swiper"
          >
            {sectionData.sub_sections.map((item, index) => {
              const translateY = [-10, 10, -10, 10, -10][index % 5];

              return (
                <SwiperSlide key={item.id}>
                  <div
                    className="relative  bg-white  rounded-none  overflow-hidden"
                    style={{ transform: `translateY(${translateY}%)` }}
                  >
                    <div className="relative w-full aspect-[3/5]">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}?v=${Date.now()}`}
                        alt="Gallery Image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80vw"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Swiper dots styling
  <style jsx global>{`
    .gallery-swiper {
      padding-bottom: 40px;
    }

    .gallery-swiper .swiper-pagination {
      bottom: 10px !important;
    }

    .gallery-swiper .swiper-pagination-bullet {
      border: 1px solid var(--primaryColor);
      background: transparent;
      opacity: 1;
    }

    .gallery-swiper .swiper-pagination-bullet-active {
      background: var(--primaryColor);
      transform: scale(1.2);
    }
  `}</style> */}
        </div>
      </div>
    </ContainerSection>
  );
}
