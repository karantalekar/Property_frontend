import { SectionData } from "@/types/home/sectionDataTypes";
import Image from "next/image";
import Heading2 from "../reusable/Heading2";
import ContainerSection from "../reusable/ContainerSection";

interface Props {
  sectionData: SectionData;
}

export default function AboutFeatureSection({ sectionData }: Props) {
  const feature1 = sectionData.sub_sections[0];
  const feature2 = sectionData.sub_sections[1];
  const feature3 = sectionData.sub_sections[2];
  const rightCard = sectionData.sub_sections[3];

  return (
    <ContainerSection>
      <div className="  ">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4 gap-6  items-start">
          {/* LEFT SIDE */}
          <div>
            <Heading2 className="max-w-xl">{sectionData.heading}</Heading2>

            {/* Features */}
            <div className="space-y-6 mt-6 md:mt-10">
              {/* Feature Item */}
              {[feature1, feature2, feature3].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  {/* Icon */}
                  <div
                    className="
                    w-12 h-12 md:w-16 md:h-16
                    rounded-full
                    shadow-md
                    border border-gray-200
                    flex items-center justify-center
                    shrink-0
                  "
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`}
                      alt=""
                      width={32}
                      height={32}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h4 className="text-base md:text-xl font-normal text-black">
                      {item.heading}
                    </h4>

                    <p className="text-sm md:text-lg text-gray-900 font-light max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* Top Description */}
            <p className="text-md md:text-lg lg:text-xl text-black md:mt-2 mb-4">
              {sectionData.description}
            </p>

            {/* Card */}
            <div className="bg-(--primaryColor-500) rounded-3xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Text Column */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <p className="text-[#2B1C14] font-normal text-base md:text-xl leading-relaxed">
                    {rightCard.heading}
                  </p>

                  <p className="italic text-sm md:text-lg text-gray-900 mt-3">
                    {rightCard.description}
                  </p>
                </div>

                {/* Image Column */}
                <div
                  className="
                  w-full md:w-1/2
                  h-[220px] md:h-[300px]
                  relative
                  rounded-2xl
                  overflow-hidden
                "
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${rightCard.image}`}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerSection>

    // </section>
  );
}
