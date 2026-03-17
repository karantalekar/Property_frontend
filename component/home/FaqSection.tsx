"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import Heading2 from "@/component/reusable/Heading2";
import ContainerSection from "../reusable/ContainerSection";
import { FaqSection as FaqSectionType } from "@/types/home/faqDataTypes";
import { sectionApi } from "@/API/home/homePageApi";

type Props = {
  sectionData?: FaqSectionType; // optional if fetched dynamically
  lang?: "en" | "ar";
  companyId?: number;
};

export default function FaqSection({
  sectionData,
  lang = "en",
  companyId = 0,
}: Props) {
  const [faqData, setFaqData] = useState<FaqSectionType | null>(
    sectionData || null,
  );
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionData) {
      const fetchFaq = async () => {
        try {
          // setLoading(true);
          const response = await sectionApi(lang, "home_page");
          if (response?.faq) {
            setFaqData(response.faq);
            setOpenId(response.faq.sub_sections?.[0]?.id || null);
          }
        } catch (err) {
          console.error("Failed to fetch FAQ:", err);
        } finally {
          // setLoading(false);
        }
      };

      fetchFaq();
    }
  }, [lang, companyId, sectionData]);

  const toggleOpen = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id));

  if (!faqData) return null;

  const leftFaq = faqData.sub_sections?.filter((_, i) => i % 2 === 0) || [];
  const rightFaq = faqData.sub_sections?.filter((_, i) => i % 2 !== 0) || [];

  const renderItem = (item: FaqSectionType["sub_sections"][number]) => {
    const isOpen = openId === item.id;
    return (
      <div
        key={item.id}
        className={`rounded-xl shadow p-6 transition-all duration-300 ease-in-out ${
          isOpen ? "bg-(--primaryColor-500)" : "bg-[#FFFFFF]"
        }`}
      >
        <button
          type="button"
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleOpen(item.id)}
        >
          <span className="text-md lg:text-2xl text-black font-medium  ">
            {item.heading}
          </span>
          <span className="w-8 h-8 flex items-center justify-center cursor-pointer">
            {isOpen ? (
              <Minus className="w-6 h-6 bg-(--primaryColor) text-white rounded-md p-1 transition-all duration-300" />
            ) : (
              <Plus className="w-6 h-6 bg-(--primaryColor) text-white rounded-md p-1 transition-all duration-300" />
            )}
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 mt-5 opacity-100 bg-(--primaryColor-500)"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="text-black leading-relaxed lg:text-xl tracking-normal">
            {item.description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ContainerSection>
      <div className=" flex flex-col gap-4">
        <Heading2 className="max-w-xl">{faqData.heading}</Heading2>
        {faqData.sub_heading && (
          <p className="text-gray-600">{faqData.sub_heading}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 lg:rounded-2xl p-0 lg:p-6">
        <div className="flex flex-col gap-6">{leftFaq.map(renderItem)}</div>
        <div className="flex flex-col gap-6">{rightFaq.map(renderItem)}</div>
      </div>
    </ContainerSection>
  );
}
