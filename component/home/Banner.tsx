"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { Banner, SectionData } from "@/types/home/sectionDataTypes";
import Link from "next/link";

interface Props {
  sectionData: SectionData;
  isHomepage?: boolean;
}

export default function BannerSection({ sectionData, isHomepage }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderBanner = (banner: Banner) => (
    <div
      className={`relative flex  w-full flex-col mt-0 items-center justify-between  md:py-32 sm:px-16 bg-white dark:bg-black sm:items-start min-h-[45vh] ${isHomepage ? "md:min-h-screen  pt-16 pb-24" : " py-24 md:min-h-[40vh]"}`}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_URL}${banner?.image}?v=${Date.now()}`}
        alt="Regent Grove Logo"
        fill
        className="object-cover "
      />

      <div
        className={`relative z-10 px-4 md:px-6  text-center text-white flex flex-col items-center justify-center w-full 
        ${isHomepage ? "xl:pt-12" : "xl:pt-0"}`}
      >
        <h1 className="mb-4 mt-5 text-2xl xl:text-5xl font-normal leading-tight">
          {banner?.heading}
        </h1>

        <p className="mb-4 xl:mb-8 text-md sm:text-xl max-w-4xl xl:max-w-5xl font-light">
          {banner?.description}
        </p>
        {banner?.btn_text && (
          <Link
            href={banner?.btn_link}
            className="rounded-md bg-white px-6 py-2 md:px-8 sm:py-3 text-md xl:text-lg font-normal text-black transition hover:bg-transparent hover:border hover:border-white-600 hover:text-white"
          >
            {banner?.btn_text}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section
      id='about-section"'
      className={`w-full bg-[#F7F7F7] overflow-hidden min-h-[45vh] ${isHomepage ? "md:min-h-screen" : "md:min-h-[40vh]"}`}
    >
      {sectionData.banner.length <= 1 ? (
        renderBanner(sectionData.banner[0])
      ) : (
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          // pagination={{
          //   clickable: true,
          // }}
          modules={[Autoplay, Pagination]}
          className="mySwiper w-full"
        >
          {sectionData.banner.map((banner) => (
            <SwiperSlide key={banner.id}>{renderBanner(banner)}</SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
