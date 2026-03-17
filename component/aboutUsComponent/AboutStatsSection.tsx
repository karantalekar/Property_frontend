"use client";

import Image from "next/image";
import Heading2 from "../reusable/Heading2";
import { useEffect, useState } from "react";
import { SectionData } from "@/types/home/sectionDataTypes";
import ContainerSection from "../reusable/ContainerSection";

interface Props {
  sectionData: SectionData;
}

export default function AboutStatsSection({ sectionData }: Props) {
  if (!sectionData) return null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const heading = sectionData.heading || "";
  const subHeading = sectionData.sub_heading || "";

  const stats = sectionData.sub_sections || [];

  const highlights = [
    "amenities, trusted hosts, and seamless booking,",
    "experience for every guest.",
  ];

  const fallbackImage1 = "/features-image2.png";
  const fallbackImage2 = "/features-image2.png";

  return (
    <div className="pt-10">
      <section className="bg-[#FFF8EE]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-10">
          {/* Left Image */}
          <div className="relative w-full h-[280px] sm:h-[360px] lg:h-full lg:min-h-[400px]">
            <Image
              src={
                sectionData.image
                  ? `${baseUrl}${sectionData.image}`
                  : fallbackImage1
              }
              alt={sectionData.image_alternate_text || "Feature image"}
              fill
              className="object-cover"
            />
          </div>

          {/* Center Content */}
          <div className="space-y-8 sm:space-y-10 self-center px-4 sm:px-6 lg:px-0 py-4 md:py-10">
            <Heading2 className="!font-light !text-[#7C5004] leading-snug max-w-sm md:!text-5xl lg:!text-6xl">
              {heading}
            </Heading2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2">
              {stats.map((item, idx) => {
                const bgClasses = [
                  "bg-[#F2EDE0] text-black",
                  "bg-[#875F1A] text-white",
                  "bg-[#CDBD9F] text-black",
                  "bg-[#F2EDE0] text-black",
                ];
                const bgClass = bgClasses[idx % bgClasses.length];

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-6 md:p-8 text-center ${bgClass}`}
                  >
                    <p className="text-3xl sm:text-4xl md:text-5xl font-semibold">
                      <CountUp end={Number(item.heading)} />+
                    </p>
                    <p className="text-sm sm:text-base md:text-lg mt-2 font-light">
                      {item.sub_heading}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-0">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mt-6 lg:mt-10">
              {/* <HighlightText text={subHeading} highlights={highlights} /> */}
              {subHeading}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex items-center">
                {["/u1.png", "/u2.png", "/u3.png", "/u4.png"].map((src, i) => (
                  <div
                    key={i}
                    className="relative w-10 h-10 rounded-full bg-[#FFF8EE] border-[0.5px] border-(--primaryColor) overflow-hidden"
                    style={{
                      marginLeft: i === 0 ? 0 : -12,
                      zIndex: 10 - i,
                    }}
                  >
                    <Image src={src} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold text-lg text-gray-800">4.8 Rated</p>
                <p className="text-sm text-gray-500">Around the globe</p>
              </div>
            </div>

            <div className="relative w-full h-[280px] sm:h-[360px] lg:flex-1">
              <Image
                src={
                  sectionData.image_2
                    ? `${baseUrl}${sectionData.image_2}`
                    : fallbackImage2
                }
                alt={sectionData.image_alternate_text_2 || "Feature image 2"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Highlighted Text */}
      <ContainerSection className="mb-4 md:mb-0 px-4 text-center text-xl sm:text-2xl md:text-5xl max-w-8xl mx-auto text-gray-800 leading-relaxed">
        <HighlightText text={subHeading} highlights={highlights} />
      </ContainerSection>
    </div>
  );
}

/* CountUp Component */
interface CountUpProps {
  end: number;
  duration?: number;
}

export function CountUp({ end, duration = 5000 }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count}</>;
}

/* HighlightText Component */
interface HighlightTextProps {
  text: string;
  highlights: string[];
}

export function HighlightText({ text, highlights }: HighlightTextProps) {
  if (!text) return null;

  const sortedHighlights = [...highlights].sort((a, b) => b.length - a.length);
  const escaped = sortedHighlights.map((w) =>
    w.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) =>
        sortedHighlights.some(
          (phrase) => phrase.toLowerCase() === part.toLowerCase(),
        ) ? (
          <span key={idx} className="text-[#875F1A] font-medium">
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </>
  );
}
