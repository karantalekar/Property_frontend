import { getBlogs } from "@/API/home/blogsApi";
import { sectionApi } from "@/API/home/homePageApi";
import AboutFeatureSection from "@/component/aboutUsComponent/AboutFeatureSection";
import AboutStatsSection from "@/component/aboutUsComponent/AboutStatsSection";
import ComfortTrustSection from "@/component/aboutUsComponent/AboutTrustSection";
import BannerScrollSection from "@/component/aboutUsComponent/BannerScrollSection";
import BannerSection from "@/component/home/Banner";
import BlogsSection from "@/component/home/Blog";
import BookingFlow from "@/component/home/bookingSection/BookingFlow";
import FaqSection from "@/component/home/FaqSection";
import GallerySection from "@/component/home/GallerySection";
import NewTestimonials from "@/component/home/NewTestimonials";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ar" ? "ar" : "en";
  const sectionData = await sectionApi(lang, "about_us");
  const hompageData = await sectionApi(lang, "home_page");
  const blogs = await getBlogs(lang, 1, 3, true);

  return (
    <div className="bg-white">
      <BannerSection sectionData={sectionData?.banner} />
      <AboutFeatureSection sectionData={sectionData?.feature} />
      <BannerScrollSection
        scrollTargetId="about-section"
        sectionData={sectionData?.explore_now}
      />
      <BookingFlow sectionData={hompageData?.booking_steps} />
      <ComfortTrustSection sectionData={sectionData.amazing_amenities} />
      <div id="about-section">
        <AboutStatsSection sectionData={sectionData.counter} />
      </div>
      <BlogsSection blog={blogs?.data ?? []} lang={lang} />

      <GallerySection sectionData={hompageData?.gallery} />

      <NewTestimonials sectionData={hompageData?.feedback} />

      <FaqSection sectionData={hompageData?.faq} />
    </div>
  );
}
