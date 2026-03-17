"use client";

import { SectionData } from "@/types/home/sectionDataTypes";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import ContainerSection from "../reusable/ContainerSection";
import Heading2 from "../reusable/Heading2";

interface Props {
  sectionData: SectionData;
}

export default function FeaturesSection({ sectionData }: Props) {
  const baseImageUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <ContainerSection>
      <div className="space-y-12 ">
        {/* HEADER  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Heading2>{sectionData.heading}</Heading2>
          <p className="text-black text-lg sm:text-xl lg:text-2xl font-light">
            {sectionData.description}
          </p>
        </motion.div>

        {/* FEATURES WRAPPER */}
        <div className="relative md:py-12">
          {/* Desktop stripe */}
          <div
            className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 z-0 rounded-md w-[150px] lg:w-[240px] bg-(--primaryColor-500)"
            aria-hidden
          />

          {/* FEATURES */}
          <div className="space-y-12 md:space-y-16 lg:space-y-24 relative z-10">
            {sectionData.sub_sections.map((feature, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-12 ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* ================= NUMBER ================= */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <span
                      className="outline-number text-[4.5rem] lg:text-[7rem]"
                      style={{ fontFamily: "var(--font-londrina-outline)" }}
                    >
                      {feature.sub_heading.padStart(2, "0")}
                    </span>
                  </div>

                  {/* ================= IMAGE ================= */}
                  <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={`w-full md:w-1/2 relative z-30 ${isEven ? "md:pe-10 lg:pe-20" : "md:ps-10 lg:ps-20"}`}
                  >
                    <div className="relative h-64  lg:h-80 overflow-hidden shadow-xl">
                      <Image
                        src={`${baseImageUrl}${feature.image}`}
                        alt={feature.heading}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>

                  {/* ================= CONTENT ================= */}
                  <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={`w-full md:w-1/2 relative z-40 ${isEven ? "md:ps-10 lg:ps-20" : "md:pe-10 lg:pe-20"}`}
                  >
                    <div
                      className={`${isEven ? "md:ps-6" : "md:pe-6"} lg:px-10`}
                    >
                      {/* Mobile number */}
                      <div className="flex gap-3 items-center">
                        <div className="md:hidden text-3xl text-[#b89b8c]">
                          <span
                            className="outline-number text-[2.5rem] "
                            style={{
                              fontFamily: "var(--font-londrina-outline)",
                            }}
                          >
                            {feature.sub_heading.padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-normal text-black md:pb-4">
                          {feature.heading}
                        </h3>
                      </div>

                      <p className="text-lg text-gray-700 leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* NUMBER OUTLINE STYLE */}
      <style jsx>{`
        .outline-number {
          color: transparent;
          -webkit-text-stroke: 1.5px var(--primaryColor);
          opacity: 0.9;
        }
      `}</style>
    </ContainerSection>
  );
}
