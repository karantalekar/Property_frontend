import { sectionApi } from "@/API/home/homePageApi";
import BannerSection from "@/component/home/Banner";
import FaqSection from "@/component/home/FaqSection";
import GallerySection from "@/component/home/GallerySection";
import FeaturesSection from "@/component/whatWeDoComponents/FeaturesSection";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ar" ? "ar" : "en";
  const sectionData = await sectionApi(lang, "what_we_do");
  const hompageData = await sectionApi(lang, "home_page");

  return (
    <div className="bg-white">
      <div id="banner">
        <BannerSection sectionData={sectionData?.banner} />
      </div>
      <FeaturesSection sectionData={sectionData?.feature} />
      <GallerySection sectionData={hompageData?.gallery} />
      <FaqSection sectionData={hompageData?.faq} />
    </div>
  );
}
