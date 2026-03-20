// import Image from "next/image";
// import { Suspense } from "react";
// import FilteredProperties from "@/component/property/FilteredProperties";
// import SearchBar from "@/component/home/searchBarComponents/SearchBar";
// import { getCityData } from "@/API/home";
// import { getPropertyTypes } from "@/API/property";

// const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com"; // adjust as needed

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//   // Resolve the search params promise
//   const params = await searchParams;

//   // Mock banner data - replace with actual data from props or API
//   const banner = {
//     image: "/banner-image.jpg",
//     heading: "Explore Our Properties",
//     description:
//       "Discover thoughtfully designed rooms that blend comfort, functionality, and modern aesthetics—perfect for everyday living.",
//   };

//   // Fetch city and property type data for the search bar
//   const cities = await getCityData();
//   const propertyTypes = await getPropertyTypes("en_US");

//   // Extract URL parameters for initial values
//   const initialValues = {
//     city: typeof params?.city === "string" ? params.city : "",
//     type: typeof params?.type === "string" ? params.type : "",
//     checkIn: typeof params?.checkIn === "string" ? params.checkIn : undefined,
//     checkOut:
//       typeof params?.checkOut === "string" ? params.checkOut : undefined,
//     adults: params?.adults ? parseInt(params.adults as string) : 0,
//     children: params?.children ? parseInt(params.children as string) : 0,
//     pets: params?.pets === "true",
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="relative w-full h-[450px] -mb-40  flex items-center justify-center text-center text-white overflow-hidden">
//         <Image
//           src="../../regent-grove-cta.png"
//           alt={banner?.heading || "Banner"}
//           fill
//           priority
//           className="object-cover"
//           unoptimized
//         />

//         {/* Dark Overlay (optional) */}
//         <div className="absolute inset-0 bg-black/40 z-10" />

//         {/* Content */}
//         <div className="relative z-10 px-4">
//           <h1 className="text-5xl md:text-6xl font-light mb-4">
//             {banner?.heading}
//           </h1>

//           <p className="text-xl md:text-2xl  opacity-90">
//             {banner?.description}
//           </p>
//         </div>
//       </section>

//       <div className="mt-17 -mb-10">
//         <SearchBar
//           cityData={cities}
//           propertyData={propertyTypes}
//           isHomepage={false}
//           lang="en"
//           initialValues={initialValues}
//         />
//       </div>

//       {/* Properties Section */}
//       <Suspense fallback={<div>Loading properties...</div>}>
//         <FilteredProperties />
//       </Suspense>
//     </>
//   );
// }

import PropertiesPageClient from "@/component/property/PropertiesPageClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const initialValues = {
    city: typeof params?.city === "string" ? params.city : "",
    type: typeof params?.type === "string" ? params.type : "",
    checkIn: typeof params?.checkIn === "string" ? params.checkIn : undefined,
    checkOut:
      typeof params?.checkOut === "string" ? params.checkOut : undefined,
    adults: params?.adults ? parseInt(params.adults as string) : 0,
    children: params?.children ? parseInt(params.children as string) : 0,
    pets: params?.pets === "true",
  };

  return <PropertiesPageClient initialValues={initialValues} />;
}
