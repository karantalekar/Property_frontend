// import { notFound } from "next/navigation";
// import {
//   ImageIcon,
//   Calendar,
//   Users,
//   FileText,
//   CheckCircle,
// } from "lucide-react";
// import { getPropertyDetails, getGalleryImages } from "@/API/property";
// import PropertyGallery from "@/component/property/PropertyGallery";

// const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

// /* =========================
//    TYPES
// ========================= */

// interface Amenity {
//   id: number;
//   name: string;
//   image: string;
// }

// interface IncludedItem {
//   id: number;
//   name: string;
// }

// interface ReviewItem {
//   id: number;
//   customer_name: string;
//   date: string;
//   rating: number;
//   review: string;
// }

// interface PolicyItem {
//   id: number;
//   description: string;
// }

// /* =========================
//    PAGE
// ========================= */

// export default async function PropertyDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   const [property, galleryImages] = await Promise.all([
//     getPropertyDetails({ slug }),
//     getGalleryImages({ slug }),
//   ]);

//   if (!property) notFound();

//   const categories = galleryImages?.categories || [];
//   const firstCategory = categories[0];
//   const firstCategoryData = galleryImages?.[firstCategory] || {
//     images: [],
//     videos: [],
//   };

//   const mainImage =
//     firstCategoryData.images[0] || property.image_1920 || "/placeholder.jpg";

//   return (
//     <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* HEADER */}
//       <div className="mb-10 mt-30 space-y-1">
//         <h1 className="md:text-5xl text-gray-900 capitalize">
//           {property.name}
//         </h1>
//         <p className="md:text-xl text-gray-500 font-medium capitalize">
//           {property.address}
//         </p>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-12 gap-12">
//         {/* GALLERY */}
//         <div className="col-span-12 space-y-6">
//           <PropertyGallery
//             categories={categories}
//             galleryImages={galleryImages}
//             BASE_URL={BASE_URL}
//           />
//         </div>

//         {/* LEFT SIDE */}
//         <div className="col-span-12 lg:col-span-8 space-y-12">
//           {/* BEDS / GUESTS */}
//           <div className="flex gap-8 text-lg text-gray-700">
//             <span> {property?.no_of_rooms} Beds</span>
//             <span> {property?.no_of_guest} Guests</span>
//           </div>

//           {/* DESCRIPTION */}
//           <section className="space-y-6">
//             {property.description ? (
//               property.description
//                 .split("\n\n")
//                 .map((paragraph: string, index: number) => (
//                   <p key={index} className="text-black leading-relaxed text-xl">
//                     {paragraph}
//                   </p>
//                 ))
//             ) : (
//               <p className="text-gray-600">
//                 Detailed information not available.
//               </p>
//             )}
//           </section>

//           {/* AMENITIES */}
//           <section>
//             <h2 className="text-5xl text-black mb-6">Room Amenities</h2>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {property.amenities?.map((amenity: Amenity) => (
//                 <div
//                   key={amenity.id}
//                   className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 bg-gradient-to-r hover:border-amber-100 text-white font-bold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-stone-100-500 hover:to-red-100 transition-all duration-300"
//                 >
//                   <img
//                     src={`${BASE_URL}${amenity.image}`}
//                     alt={amenity.name}
//                     className="w-15 h-15 object-contain"
//                   />
//                   <span className="text-lg text-gray-700 font-medium">
//                     {amenity.name}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* WHAT'S INCLUDED */}
//           <section>
//             <h2 className="text-5xl text-black mb-4">
//               What's included in this suite?
//             </h2>

//             <ul className="space-y-3">
//               {property.whats_include?.map((item: IncludedItem) => (
//                 <li
//                   key={item.id}
//                   className="flex items-center gap-3 text-xl text-black"
//                 >
//                   <CheckCircle size={18} className="text-[#8b6a55]" />
//                   {item.name}
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </div>

//         {/* RIGHT SIDE */}
//         <aside className="col-span-12 lg:col-span-4 space-y-8 lg:sticky lg:top-24">
//           {/* BOOK NOW */}
//           <div className="bg-white p-6 rounded-2xl border border-[#c9a891] shadow-sm space-y-5">
//             <div className="flex justify-between items-center">
//               <h3 className="text-2xl text-black font-semibold">Book Now</h3>
//               <span className="text-xl text-black">
//                 From{" "}
//                 <span className="font-semibold text-xl text-black">
//                   SAR {property?.list_price}
//                 </span>
//                 <span className="text-gray-500">
//                   /{property?.night_count} night
//                 </span>
//               </span>
//             </div>

//             <div className="flex items-center gap-3 p-3 text-black bg-gray-50 rounded-lg">
//               <Calendar size={25} />
//               <input
//                 type="date"
//                 className="bg-transparent w-full outline-none"
//               />
//             </div>

//             <div className="flex items-center gap-3 p-3 text-black bg-gray-50 rounded-lg">
//               <Calendar size={25} />
//               <input
//                 type="date"
//                 className="bg-transparent w-full outline-none"
//               />
//             </div>

//             <div className="flex items-center gap-3 p-3 text-black bg-gray-50 rounded-lg">
//               <Users size={25} />
//               <span>{property?.no_of_guest} Guests</span>
//             </div>

//             <button className="w-full bg-[#8b6a55] text-white py-3 rounded-lg text-xl">
//               Check Availability
//             </button>
//           </div>

//           {/* TERMS */}
//           <div className="bg-[#f8f3ef] p-6 rounded-2xl border border-dashed border-[#c9a891]">
//             <h3 className="text-5xl text-black mb-5">Terms & Policies</h3>

//             <div className="space-y-4 text-lg">
//               {property?.policies?.map((policy: PolicyItem) => (
//                 <div key={policy.id} className="flex gap-3">
//                   <FileText size={25} className="text-[#8b6a55]" />
//                   <p className="text-gray-700">{policy.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* MAP */}
//           <div className="rounded-xl overflow-hidden shadow-lg border border-[#c9a891]">
//             <iframe
//               width="100%"
//               height="280"
//               loading="lazy"
//               src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&z=15&output=embed`}
//               className="border-0"
//             />
//           </div>
//         </aside>
//       </div>

//       {/* REVIEWS FULL WIDTH */}

//       {/* REVIEWS FULL WIDTH */}
//       <section className="mt-24 bg-[#FFFBF1] md:px-12 py-10 px-6 rounded-3xl">
//         <h2 className="text-5xl text-black text-center mb-10">Guest Reviews</h2>

//         {/* REVIEW CARDS */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
//           {property.reviews?.map((review: ReviewItem) => (
//             <div
//               key={review.id}
//               className="bg-white p-6 rounded-2xl shadow-sm border"
//             >
//               <div className="flex justify-between mb-3">
//                 <h4 className="font-bold text-black">{review.customer_name}</h4>
//                 <span className="text-sm text-gray-400">{review.date}</span>
//               </div>

//               <div className="text-amber-400 mb-3 text-lg">
//                 {"★".repeat(review.rating)}
//                 {"☆".repeat(5 - review.rating)}
//               </div>

//               <p className="text-gray-600 italic">{review.review}</p>
//             </div>
//           ))}
//         </div>

//         {/* REVIEW SUBMISSION */}

//         {/* REVIEW SUBMISSION - Exact Match to Screenshot */}
//         <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
//           {/* Box Heading */}
//           <h3 className="text-xl font-bold text-gray-900 mb-6">
//             Write a Review
//           </h3>

//           <div className="flex flex-col md:flex-row items-center gap-6">
//             {/* 1. Stars on the left */}
//             <div className="flex gap-1 text-2xl text-gray-300 shrink-0">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                   key={star}
//                   className="cursor-pointer hover:text-amber-200 transition"
//                 >
//                   ★
//                 </span>
//               ))}
//             </div>

//             {/* 2. Textarea in the middle - set to one line with flex-1 */}
//             <div className="flex-1 w-full">
//               <textarea
//                 rows={1}
//                 placeholder="Write your review here..."
//                 className="w-full border border-gray-200 rounded-md px-4 py-4 text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none bg-white"
//               />
//             </div>

//             {/* 3. The Submit Button */}
//             <div className="w-full md:w-auto flex justify-center">
//               <button
//                 type="button"
//                 className="bg-[#C2B2A9] text-white px-10 py-3 rounded-md text-sm font-semibold hover:bg-[#C2A68C] transition-colors whitespace-nowrap shadow-sm"
//               >
//                 Submit Review
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// ================================================================================================

// import { notFound } from "next/navigation";
// import {
//   ImageIcon,
//   Calendar,
//   Users,
//   FileText,
//   CheckCircle,
// } from "lucide-react";
// import { getPropertyDetails, getGalleryImages } from "@/API/property";
// import PropertyGallery from "@/component/property/PropertyGallery";

// const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

// /* =========================
//    TYPES
// ========================= */

// interface Amenity {
//   id: number;
//   name: string;
//   image: string;
// }

// interface IncludedItem {
//   id: number;
//   name: string;
// }

// interface ReviewItem {
//   id: number;
//   customer_name: string;
//   date: string;
//   rating: number;
//   review: string;
// }

// interface PolicyItem {
//   id: number;
//   description: string;
// }

// /* =========================
//    PAGE
// ========================= */

// async function PropertyDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   const [property, galleryImages] = await Promise.all([
//     getPropertyDetails({ slug }),
//     getGalleryImages({ slug }),
//   ]);

//   if (!property) notFound();

//   const categories = galleryImages?.categories || [];
//   const firstCategory = categories[0];
//   const firstCategoryData = galleryImages?.[firstCategory] || {
//     images: [],
//     videos: [],
//   };

//   const mainImage =
//     firstCategoryData.images[0] || property.image_1920 || "/placeholder.jpg";

//   return (
//     <main className="w-full bg-white">
//       {/* HEADER */}
//       <div className="px-4 sm:px-6 md:px-8 lg:px-8 mb-6 sm:mb-8 md:mb-10 mt-6 sm:mt-8 md:mt-10 space-y-1">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 capitalize font-bold">
//           {property.name}
//         </h1>
//         <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-medium capitalize">
//           {property.address}
//         </p>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-8">
//         {/* GALLERY */}
//         <div className="col-span-1 lg:col-span-12 space-y-6">
//           <PropertyGallery
//             categories={categories}
//             galleryImages={galleryImages}
//             BASE_URL={BASE_URL}
//           />
//         </div>

//         {/* LEFT SIDE */}
//         <div className="col-span-1 lg:col-span-8 space-y-8 sm:space-y-10 md:space-y-12">
//           {/* BEDS / GUESTS */}
//           <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg text-gray-700">
//             <span> {property?.no_of_rooms} Beds</span>
//             <span> {property?.no_of_guest} Guests</span>
//           </div>

//           {/* DESCRIPTION */}
//           <section className="space-y-4 sm:space-y-6">
//             {property.description ? (
//               property.description
//                 .split("\n\n")
//                 .map((paragraph: string, index: number) => (
//                   <p
//                     key={index}
//                     className="text-black leading-relaxed text-base sm:text-lg md:text-lg lg:text-xl"
//                   >
//                     {paragraph}
//                   </p>
//                 ))
//             ) : (
//               <p className="text-gray-600">
//                 Detailed information not available.
//               </p>
//             )}
//           </section>

//           {/* AMENITIES */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-4 sm:mb-5 md:mb-6 font-bold">
//               Room Amenities
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
//               {property.amenities?.map((amenity: Amenity) => (
//                 <div
//                   key={amenity.id}
//                   className="p-4 sm:p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 bg-gradient-to-r hover:border-amber-100 font-bold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-stone-100 hover:to-red-100 transition-all duration-300"
//                 >
//                   <img
//                     src={`${BASE_URL}${amenity.image}`}
//                     alt={amenity.name}
//                     className="w-12 sm:w-14 md:w-15 h-12 sm:h-14 md:h-15 object-contain flex-shrink-0"
//                   />
//                   <span className="text-sm sm:text-base md:text-lg text-gray-700 font-medium">
//                     {amenity.name}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* WHAT'S INCLUDED */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-3 sm:mb-4 font-bold">
//               What's included in this suite?
//             </h2>

//             <ul className="space-y-2 sm:space-y-3">
//               {property.whats_include?.map((item: IncludedItem) => (
//                 <li
//                   key={item.id}
//                   className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-lg lg:text-xl text-black"
//                 >
//                   <CheckCircle
//                     size={18}
//                     className="text-[#8b6a55] flex-shrink-0"
//                   />
//                   {item.name}
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </div>

//         {/* RIGHT SIDE */}
//         <aside className="col-span-1 lg:col-span-4 space-y-6 sm:space-y-7 md:space-y-8 lg:sticky lg:top-24">
//           {/* BOOK NOW */}
//           <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-[#c9a891] shadow-sm space-y-4 sm:space-y-5">
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//               <h3 className="text-lg sm:text-xl md:text-2xl text-black font-semibold">
//                 Book Now
//               </h3>
//               <div className="text-right">
//                 <span className="text-base sm:text-lg md:text-xl text-black">
//                   <span className="font-semibold text-lg sm:text-xl md:text-xl text-black block">
//                     SAR {property?.list_price}
//                   </span>
//                   <span className="text-gray-500 text-sm">
//                     /{property?.night_count} night
//                   </span>
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
//               <Calendar size={20} className="flex-shrink-0" />
//               <input
//                 type="date"
//                 className="bg-transparent w-full outline-none text-sm sm:text-base"
//               />
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
//               <Calendar size={20} className="flex-shrink-0" />
//               <input
//                 type="date"
//                 className="bg-transparent w-full outline-none text-sm sm:text-base"
//               />
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
//               <Users size={20} className="flex-shrink-0" />
//               <span className="text-sm sm:text-base">
//                 {property?.no_of_guest} Guests
//               </span>
//             </div>

//             <button className="w-full bg-[#8b6a55] text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-medium hover:bg-[#6f5443] transition-colors">
//               Check Availability
//             </button>
//           </div>

//           {/* TERMS */}
//           <div className="bg-[#f8f3ef] p-4 sm:p-5 md:p-6 rounded-2xl border border-dashed border-[#c9a891]">
//             <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-black mb-3 sm:mb-4 md:mb-5 font-bold">
//               Terms & Policies
//             </h3>

//             <div className="space-y-3 sm:space-y-4">
//               {property?.policies?.map((policy: PolicyItem) => (
//                 <div key={policy.id} className="flex gap-2 sm:gap-3">
//                   <FileText
//                     size={20}
//                     className="text-[#8b6a55] flex-shrink-0 mt-1"
//                   />
//                   <p className="text-gray-700 text-sm sm:text-base md:text-lg">
//                     {policy.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* MAP */}
//           <div className="rounded-xl overflow-hidden shadow-lg border border-[#c9a891] h-64 sm:h-72 md:h-80 lg:h-80">
//             <iframe
//               width="100%"
//               height="100%"
//               loading="lazy"
//               src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&z=15&output=embed`}
//               className="border-0"
//               title="Property location"
//             />
//           </div>
//         </aside>
//       </div>

//       {/* REVIEWS FULL WIDTH */}
//       <section className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 bg-[#FFFBF1] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-8">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black text-center mb-8 sm:mb-10 font-bold">
//           Guest Reviews
//         </h2>

//         {/* REVIEW CARDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 lg:mb-14">
//           {property.reviews?.map((review: ReviewItem) => (
//             <div
//               key={review.id}
//               className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border"
//             >
//               <div className="flex justify-between mb-2 sm:mb-3">
//                 <h4 className="font-bold text-black text-sm sm:text-base">
//                   {review.customer_name}
//                 </h4>
//                 <span className="text-xs sm:text-sm text-gray-400">
//                   {review.date}
//                 </span>
//               </div>

//               <div className="text-amber-400 mb-2 sm:mb-3 text-lg md:text-xl">
//                 {"★".repeat(review.rating)}
//                 {"☆".repeat(5 - review.rating)}
//               </div>

//               <p className="text-gray-600 italic text-sm sm:text-base">
//                 {review.review}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* REVIEW SUBMISSION */}
//         <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
//           {/* Box Heading */}
//           <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
//             Write a Review
//           </h3>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
//             {/* 1. Stars on the left */}
//             <div className="flex gap-1 text-xl sm:text-2xl text-gray-300 shrink-0">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                   key={star}
//                   className="cursor-pointer hover:text-amber-200 transition text-lg sm:text-2xl"
//                 >
//                   ★
//                 </span>
//               ))}
//             </div>

//             {/* 2. Textarea and Button Container */}
//             <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
//               <textarea
//                 rows={1}
//                 placeholder="Write your review here..."
//                 className="flex-1 border border-gray-200 rounded-md px-3 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none bg-white w-full"
//               />

//               {/* 3. Submit Button */}
//               <button
//                 type="button"
//                 className="w-full sm:w-auto bg-[#C2B2A9] text-white px-6 sm:px-10 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-semibold hover:bg-[#C2A68C] transition-colors whitespace-nowrap shadow-sm"
//               >
//                 Submit Review
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default PropertyDetailPage;

import { notFound } from "next/navigation";
import {
  ImageIcon,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Bed,
  User,
} from "lucide-react";
import { getPropertyDetails, getGalleryImages } from "@/API/property";
import PropertyGallery from "@/component/property/PropertyGallery";

const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

/* =========================
   TYPES
========================= */

interface Amenity {
  id: number;
  name: string;
  image: string;
}

interface IncludedItem {
  id: number;
  name: string;
}

interface ReviewItem {
  id: number;
  customer_name: string;
  date: string;
  rating: number;
  review: string;
}

interface PolicyItem {
  id: number;
  description: string;
}

/* =========================
   PAGE
========================= */

async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [property, galleryImages] = await Promise.all([
    getPropertyDetails({ slug }),
    getGalleryImages({ slug }),
  ]);

  if (!property) notFound();

  const categories = galleryImages?.categories || [];
  const firstCategory = categories[0];
  const firstCategoryData = galleryImages?.[firstCategory] || {
    images: [],
    videos: [],
  };

  const mainImage =
    firstCategoryData.images[0] || property.image_1920 || "/placeholder.jpg";

  return (
    <main className="w-full bg-white mt-28 sm:mt-32 md:-mt-10 lg:mt-48">
      {/* HEADER */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-20 mb-6 sm:mb-8  space-y-1">
        <h1 className="text-3xl sm:text-3xl md:text-6xl lg:text-5xl text-gray-900 ">
          {property.name}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-medium capitalize">
          {property.address}
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-20">
        {/* GALLERY */}
        <div className="col-span-1 lg:col-span-12 space-y-6">
          <PropertyGallery
            categories={categories}
            galleryImages={galleryImages}
            BASE_URL={BASE_URL}
          />
        </div>

        {/* LEFT SIDE */}
        <div className="col-span-1 lg:col-span-8 space-y-8 sm:space-y-10 md:space-y-12">
          {/* BEDS / GUESTS */}
          {/* <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg text-black">
            <span className="underline">
              {" "}
              {property?.no_of_rooms} <Bed size={15} />
              Beds
            </span>
            <span>
              {" "}
              {property?.no_of_guest} <User size={15} /> Guests
            </span>
          </div> */}
          {/* BEDS / GUESTS */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-4 text-base sm:text-lg text-gray-700 md:text-xl underline">
            <span className="flex items-center gap-1  hover:text-[#8b6a55]">
              {" "}
              <Bed size={20} />
              {property?.no_of_rooms} Beds
            </span>
            <span className="flex items-center   hover:text-[#8b6a55]">
              <User size={20} />
              {property?.no_of_guest} Guests
            </span>
          </div>

          {/* DESCRIPTION */}
          <section className="space-y-4 sm:space-y-6">
            {property.description ? (
              property.description
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-black leading-relaxed text-base sm:text-lg md:text-xl lg:text-xl"
                  >
                    {paragraph}
                  </p>
                ))
            ) : (
              <p className="text-gray-600">
                Detailed information not available.
              </p>
            )}
          </section>

          {/* AMENITIES */}
          <section>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black mb-4 sm:mb-5 md:mb-6 ">
              Room Amenities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
              {property.amenities?.map((amenity: Amenity) => (
                <div
                  key={amenity.id}
                  className="p-4 sm:p-6 md:p-8 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 bg-gradient-to-r hover:border-amber-100 font-bold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-stone-100 hover:to-red-100 transition-all duration-300"
                >
                  <img
                    src={`${BASE_URL}${amenity.image}`}
                    alt={amenity.name}
                    className="w-12 sm:w-14 md:w-15 h-12 sm:h-14 md:h-15 object-contain flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                    {amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* WHAT'S INCLUDED */}
          <section>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black mb-3 sm:mb-4 ">
              What's included in this suite?
            </h2>

            <ul className="space-y-2 sm:space-y-3">
              {property.whats_include?.map((item: IncludedItem) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-2xl lg:text-xl text-black"
                >
                  <CheckCircle
                    size={18}
                    className="text-[#8b6a55] flex-shrink-0"
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="col-span-1 lg:col-span-4 space-y-6 sm:space-y-7 md:space-y-8 lg:sticky lg:top-24">
          {/* BOOK NOW */}
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-[#c9a891] shadow-sm space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <h3 className="text-lg sm:text-xl md:text-3xl text-black ">
                Book Now
              </h3>
              <div className="text-right">
                <span className="text-base sm:text-lg md:text-xl text-black">
                  <span className="font-semibold text-lg sm:text-xl md:text-xl text-black block">
                    SAR {property?.list_price}
                  </span>
                  <span className="text-gray-500 text-sm">
                    /{property?.night_count} night
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
              <Calendar size={20} className="flex-shrink-0" />
              <input
                type="date"
                className="bg-transparent w-full outline-none text-sm sm:text-base"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
              <Calendar size={20} className="flex-shrink-0" />
              <input
                type="date"
                className="bg-transparent w-full outline-none text-sm sm:text-base"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-black bg-gray-50 rounded-lg">
              <Users size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">
                {property?.no_of_guest} Guests
              </span>
            </div>

            <button className="w-full bg-[#8b6a55] text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-medium hover:bg-[#6f5443] transition-colors">
              Check Availability
            </button>
          </div>

          {/* TERMS */}
          <div className="bg-[#f8f3ef] p-4 sm:p-5 md:p-6 rounded-2xl border border-dashed border-[#c9a891]">
            <h3 className="text-xl sm:text-2xl md:text-5xl lg:text-5xl text-black mb-3 sm:mb-4 md:mb-5 ">
              Terms & Policies
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {property?.policies?.map((policy: PolicyItem) => (
                <div key={policy.id} className="flex gap-2 sm:gap-3">
                  <FileText
                    size={20}
                    className="text-[#8b6a55] flex-shrink-0 mt-1"
                  />
                  <p className="text-gray-700 text-sm sm:text-base md:text-xl">
                    {policy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MAP */}
          <div className="rounded-xl overflow-hidden shadow-lg border border-[#c9a891] h-64 sm:h-72 md:h-80 lg:h-80">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&z=15&output=embed`}
              className="border-0"
              title="Property location"
            />
          </div>
        </aside>
      </div>

      {/* REVIEWS FULL WIDTH */}
      <section className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 bg-[#FFFBF1] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 lg:px-20 rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-20">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl text-black text-center mb-8 sm:mb-10 ">
          Guest Reviews
        </h2>

        {/* REVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 lg:mb-14">
          {property.reviews?.map((review: ReviewItem) => (
            <div
              key={review.id}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border"
            >
              <div className="flex justify-between mb-2 sm:mb-3">
                <h4 className="font-bold text-black text-sm sm:text-base md:text-xl">
                  {review.customer_name}
                </h4>
                <span className="text-xs sm:text-sm text-gray-400">
                  {review.date}
                </span>
              </div>

              <div className="text-amber-400 mb-2 sm:mb-3 text-lg md:text-xl">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="text-gray-600 italic text-sm sm:text-base">
                {review.review}
              </p>
            </div>
          ))}
        </div>

        {/* REVIEW SUBMISSION */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
          {/* Box Heading */}
          <h3 className="text-base sm:text-lg md:text-2xl  text-gray-900 mb-4 sm:mb-6">
            Write a Review
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
            {/* 1. Stars on the left */}
            <div className="flex gap-1 text-xl sm:text-2xl text-gray-300 shrink-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="cursor-pointer hover:text-amber-200 transition text-lg sm:text-2xl"
                >
                  ★
                </span>
              ))}
            </div>

            {/* 2. Textarea and Button Container */}
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
              <textarea
                rows={1}
                placeholder="Write your review here..."
                className="flex-1 border border-gray-200 rounded-md px-3 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none bg-white w-full"
              />

              {/* 3. Submit Button */}
              <button
                type="button"
                className="w-full sm:w-auto bg-[#C2B2A9] text-white px-6 sm:px-10 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-semibold hover:bg-[#C2A68C] transition-colors whitespace-nowrap shadow-sm"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PropertyDetailPage;
