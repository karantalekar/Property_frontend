import Heading2 from "../reusable/Heading2";
import ContainerSection from "../reusable/ContainerSection";
import Image from "next/image";
import { SectionData } from "@/types/home/sectionDataTypes";

interface Props {
  sectionData: SectionData;
}

export default function ComfortTrustSection({ sectionData }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <ContainerSection>
      {/* Main Heading */}
      <Heading2 className="text-black max-w-4xl mb-12">
        {sectionData?.heading}
      </Heading2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {sectionData?.sub_sections?.map((sub) => (
          <div
            key={sub.id}
            className="bg-[var(--primaryColor)] rounded-[14px] shadow-md"
          >
            <div className="bg-white rounded-[14px] mt-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center p-2 px-4 md:p-8 h-full">
              {/* Icon wrapper */}
              <div className="mb-4 h-18 md:h-24 flex items-center justify-center">
                <Image
                  src={
                    sub.image ? `${baseUrl}${sub.image}` : "/fallback-icon.png"
                  }
                  alt={sub.image_alternate_text || sub.heading}
                  width={84}
                  height={84}
                  className="object-contain w-18 h-18 "
                />
              </div>

              {/* Card Title */}
              <h3 className="font-semibold text-md md:text-2xl mb-2 text-black">
                {sub.heading}
              </h3>

              {/* Card Description */}
              <p className="text-gray-600 text-md md:text-xl font-light leading-relaxed">
                {sub.sub_heading}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContainerSection>
  );
}
