// components/booking/BookingFlow.tsx
"use client";

import Heading2 from "../../reusable/Heading2";
import { StepCard } from "./StepCard";
import { FlowArrow } from "./FlowArrow";
import Section from "@/component/reusable/Section";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SectionData } from "@/types/home/sectionDataTypes";

interface Props {
  sectionData: SectionData;
}

export default function BookingFlow({ sectionData }: Props) {
  const lang = useSelector((state: RootState) => state);
  return (
    <>
      <Heading2 className="container mx-auto px-4 sm:px-6   pb-4  xl:pb-6  space-y-4 md:space-y-6 text-center md:text-start">
        {sectionData.heading}
      </Heading2>
      <Section className="bg-[var(--primaryColor-500)] ">
        <div className="container mx-auto space-y-6 md:space-y-10 px-4 sm:px-6 lg:px-10 pt-6 pb-4 xl:pt-10 xl:pb-10  ">
          {/* Flow: stack on small screens; row on md+ */}
          <div className="flex flex-col md:flex-row justify-center">
            {sectionData?.sub_sections?.map((step, idx) => {
              // alternate offset: even index -> up, odd -> down
              // remove vertical offset on small screens with responsive Tailwind
              const isEven = idx % 2 === 0;
              const isOffsetEven = "en";

              const offsetClass = isOffsetEven ? "md:pt-16" : "";

              return (
                <div key={step.id} className="md:flex">
                  {/* Step card */}
                  <StepCard
                    title={step?.heading || ""}
                    description={step?.description || ""}
                    icon={step?.image}
                    altText={step?.image_alternate_text || "Step Icon"}
                    offsetClass={offsetClass}
                  />

                  {/* Arrow (between steps only) */}
                  {idx !== sectionData?.sub_sections?.length - 1 && (
                    // Use rotate from current step (or next step) — here we use current step.rotate
                    <FlowArrow rotate={isEven ? -10 : 40} isEven={isEven} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
