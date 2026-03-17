"use client";

import { SectionData } from "@/types/home/sectionDataTypes";
import Image from "next/image";
import ContainerSection from "../reusable/ContainerSection";
import { ArrowDown } from "lucide-react";

type Props = {
  scrollTargetId: string;
  sectionData: SectionData;
};

export default function BannerScrollSection({
  scrollTargetId,
  sectionData,
}: Props) {
  const handleScroll = () => {
    const el = document.getElementById(scrollTargetId);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <div className=" container mx-auto relative flex min-h-[200px] lg:min-h-[300px] xl:min-h-[450px] w-full h-full  bg-white   mt-10   mb-7">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_URL}${sectionData?.image}?v=${Date.now()}`}
        alt={sectionData?.image_alternate_text || "Regent Grove Logo"}
        fill
        className="object-cover md:rounded-2xl"
      />
      {/* Scroll Arrow */}
      <button
        onClick={handleScroll}
        className="
    absolute
    -top-11
    left-1/2
    -translate-x-1/2
    md:w-24 md:h-24
    w-18 h-18
    rounded-full
    bg-(--primaryColor)
    flex
    items-center
    justify-center
    z-20
    hover:scale-105
    transition border-10 border-white
    cursor-pointer
  "
      >
        <ArrowDown size={42} />
      </button>

      <ContainerSection className="relative z-10 h-full flex flex-col items-center justify-center text-center ">
        <h1 className="text-black max-w-[400px] md:max-w-[60%] text-xl lg:text-3xl xl:text-5xl font-normal mt-8 ">
          {sectionData?.heading}
        </h1>
      </ContainerSection>
    </div>
  );
}
