"use client";

import { LegalPageResult } from "@/types/legalPageTypes";
import { useEffect, useRef, useState } from "react";
import { LegalPagePDFDownload } from "./LegalPagePDFDownload";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface LegalPageComponentProps {
  data: LegalPageResult;
}

export default function LegalPageComponent({ data }: LegalPageComponentProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lang = useSelector((state: RootState) => state);

  // Set up intersection observer to track which section is in view
  useEffect(() => {
    const currentRefs = sectionRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
      },
    );

    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [data.points]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full text-black ">
      {/* Curved header section */}
      {/* Legal Page Banner – same sizing as BannerSection */}
      <div
        className="
    relative w-full overflow-hidden
    flex items-center justify-center
    min-h-[45vh] md:min-h-[40vh]
    py-24 md:py-32
    bg-cover bg-center 
  "
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}${data.image})`,
        }}
      >
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col gap-8">
          {/* Heading */}
          <h1 className="text-2xl xl:text-5xl font-normal text-white">
            {data.heading}
          </h1>

          {/* Bottom pinned row */}
          <div className="absolute top-30 left-0 right-0 px-4">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-white text-sm md:text-base">
              {/* Date */}
              <div className="flex items-center gap-3 rounded-full bg-black/40 px-4 py-2 text-white backdrop-blur-sm">
                <span className="text-xs uppercase tracking-wide opacity-70">
                  {"Last updated"}
                </span>
                <span className="h-4 w-px bg-white/30" />
                <span className="text-sm font-medium">{data.write_date}</span>
              </div>

              {/* Download */}
              <LegalPagePDFDownload data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Content section with sidebar for desktop */}
      <div className="container mx-auto px-4 md:px-8 py-4 my-12">
        <div className="lg:flex lg:gap-8 xl:gap-12">
          {/* Main content */}
          <div className="lg:w-3/4 xl:w-4/5 space-y-10">
            {data.description && (
              <p className="mb-8 md:text-2xl">
                <span className="text-red-500">* </span>
                {data.description}
              </p>
            )}
            {data.points.map((term) => (
              <div
                key={term.id}
                id={`section-${term.id}`}
                ref={(el) => {
                  sectionRefs.current[`section-${term.id}`] = el;
                }}
                className="space-y-4 scroll-mt-8"
              >
                <h2 className="text-xl font-medium md:text-3xl">
                  {term.sequence_number}. {term.heading}
                </h2>
                <p className="md:text-2xl">{term.description}</p>

                {term.sub_points.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {term.sub_points.map((subPoint) => (
                      <li
                        key={subPoint.id}
                        className="flex items-start md:text-2xl"
                      >
                        <span className="mr-2">·</span>
                        <span>{subPoint.sub_point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {/* Sidebar navigation for desktop */}
          <aside className="hidden lg:block lg:w-1/4 xl:w-1/5">
            <div className="sticky top-8 border border-gray-100 shadow-sm rounded-lg overflow-hidden">
              {/* Sidebar header */}
              <div className="bg-(--primaryColor) text-white py-4 px-5">
                <h3 className="text-lg font-medium text-black">
                  Table of Contents
                </h3>
              </div>

              {/* Navigation items */}
              <nav className="py-2">
                {data.points.map((term) => (
                  <button
                    key={`nav-${term.id}`}
                    onClick={() => scrollToSection(`section-${term.id}`)}
                    className={`group relative flex w-full items-center gap-3 px-5 py-3 text-left transition-all duration-200
                      ${
                        activeSection === `section-${term.id}`
                          ? "bg-gray-50 font-medium text-(--primaryColor) "
                          : "hover:bg-gray-50 hover:text-black"
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {activeSection === `section-${term.id}` && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-(--primaryColor)"></div>
                    )}

                    {/* Section number */}
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-sm
                      ${
                        activeSection === `section-${term.id}`
                          ? "bg-(--primaryColor) text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }
                    `}
                    >
                      {term.sequence_number}
                    </span>

                    {/* Section title */}
                    <span className="line-clamp-2 text-sm">{term.heading}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
