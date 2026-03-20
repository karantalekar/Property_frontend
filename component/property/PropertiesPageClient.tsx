"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Suspense } from "react";
import FilteredProperties from "@/component/property/FilteredProperties";
import SearchBar from "@/component/home/searchBarComponents/SearchBar";
import { getCityData } from "@/API/home";
import { getPropertyTypes } from "@/API/property";

export default function PropertiesPageClient({ initialValues }: any) {
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const banner = {
    image: "/banner-image.jpg",
    heading: "Explore Our Properties",
    description:
      "Discover thoughtfully designed rooms that blend comfort, functionality, and modern aesthetics—perfect for everyday living.",
  };

  useEffect(() => {
    getCityData().then(setCities);
    getPropertyTypes("en_US").then(setPropertyTypes);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[450px] -mb-40 flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/regent-grove-cta.png"
          alt={banner.heading}
          fill
          priority
          className="object-cover"
          unoptimized
        />

        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-light mb-4">
            {banner.heading}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">{banner.description}</p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="mt-17 -mb-10">
        <SearchBar
          cityData={cities}
          propertyData={propertyTypes}
          isHomepage={false}
          lang="en"
          initialValues={initialValues}
        />
      </div>

      {/* Properties Section */}
      <Suspense fallback={<div>Loading properties...</div>}>
        <FilteredProperties />
      </Suspense>
    </>
  );
}
