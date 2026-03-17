import Image from "next/image";
import FilteredProperties from "@/component/property/FilteredProperties";

const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com"; // adjust as needed

export default function Page() {
  // Mock banner data - replace with actual data from props or API
  const banner = {
    image: "/banner-image.jpg",
    heading: "Explore Our Properties",
    description:
      "Discover thoughtfully designed rooms that blend comfort, functionality, and modern aesthetics—perfect for everyday living.",
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[450px]  flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="../../regent-grove-cta.png"
          alt={banner?.heading || "Banner"}
          fill
          priority
          className="object-cover"
          unoptimized
        />

        {/* Dark Overlay (optional) */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-light mb-4">
            {banner?.heading}
          </h1>

          <p className="text-xl md:text-2xl  opacity-90">
            {banner?.description}
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <FilteredProperties />
    </>
  );
}
