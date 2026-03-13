// "use client";
// import Link from "next/link";
// import {
//   Star,
//   Heart,
//   MapPin,
//   Users,
//   DoorOpen,
//   Shield,
//   ArrowRight,
// } from "lucide-react";

// const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

// // interface Property {
// //   id: number;
// //   slug: string;
// //   name: string;
// //   image_1920: string;
// //   rating: number;
// //   review_count: number;
// //   list_price: number;
// //   city: string;
// //   guests: number;
// //   rooms: number;
// // }
// interface Property {
//   id: number;
//   slug: string;
//   name: string;
//   image_1920: string;
//   rating: number;
//   review_count: number;
//   list_price: number;

//   city_name: string;
//   no_of_guest: number;
//   no_of_rooms: number;

//   amenities: { id: number; name: string }[];
// }
// interface PropertyListProps {
//   data: Property[];
// }

// export default function PropertyList({ data }: PropertyListProps) {
//   if (!data?.length) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20">
//         <p className="text-gray-500 text-lg">No properties found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 mt-30">
//       <div className="max-w-lg mx-auto px-6 space-y-6">
//         {data.map((property) => (
//           <Link
//             href={`/properties/${property.slug}`}
//             key={property.id}
//             className="block"
//           >
//             <article className="group bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
//               {/* FULL WIDTH IMAGE */}
//               <div className="relative h-[200px]">
//                 <img
//                   src={`${BASE_URL}${property.image_1920}`}
//                   alt={property.name}
//                   className="w-full h-full object-cover"
//                   loading="lazy"
//                 />

//                 {/* TOP RIGHT: 3 VERTICAL BUTTONS */}
//                 <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-10">
//                   <button className="w-12 h-12 bg-white/90 backdrop-blur-xl rounded-[20px] shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-2xl transition-all duration-200">
//                     <MapPin size={18} className="text-gray-700" />
//                   </button>
//                   <button className="w-12 h-12 bg-white/90 backdrop-blur-xl rounded-[20px] shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-2xl transition-all duration-200">
//                     <Heart
//                       size={25}
//                       className="text-gray-700 group-hover:text-red-500"
//                     />
//                   </button>
//                   <button className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-[20px] shadow-xl flex items-center justify-center hover:from-emerald-600 hover:shadow-2xl transition-all duration-200">
//                     <Shield size={16} />
//                   </button>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="p-6 pb-8">
//                 {/* TITLE + RATING (TOP ROW) */}
//                 <div className="flex items-start justify-between mb-4">
//                   <h3 className="text-xl font-bold text-gray-900 leading-tight pr-12 max-w-[70%]">
//                     {property.name}
//                   </h3>
//                   <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto">
//                     <Star
//                       size={18}
//                       className="fill-yellow-400 text-yellow-400"
//                     />
//                     <span className="text-sm font-bold text-gray-900">
//                       {property.rating}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       ({property.review_count} Reviews)
//                     </span>
//                   </div>
//                 </div>

//                 {/* LOCATION */}
//                 <div className="flex items-center gap-1.5 mb-6 text-gray-700 text-sm">
//                   <MapPin size={16} className="text-gray-500" />
//                   <span>{property.city_name}</span>
//                 </div>

//                 {/* 4 HORIZONTAL BADGES */}
//                 <div className="flex items-center gap-2.5 mb-8">
//                   <div className="px-3 py-1.5 bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-2xl text-xs font-medium text-orange-800 shadow-sm">
//                     {property.availability || 4} Available
//                   </div>
//                   <div className="px-3 py-1.5 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 rounded-2xl text-xs font-medium text-emerald-800 shadow-sm flex items-center gap-1">
//                     <DoorOpen size={12} className="text-black bg-grey-400" />
//                     {property.no_of_rooms} Rooms
//                   </div>
//                   <div className="px-3 py-1.5 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl text-xs font-medium text-black shadow-sm flex items-center gap-1">
//                     <Users size={12} className="text-black" />
//                     {property.no_of_guest} Guests
//                   </div>
//                   <div className="px-3 py-1.5 bg-purple-50/80 backdrop-blur-sm border border-purple-200 rounded-2xl text-xs font-medium text-purple-800 shadow-sm flex items-center gap-1">
//                     <Shield size={12} className="text-black bg-grey-200" />
//                     All Pets
//                   </div>
//                 </div>

//                 {/* BOTTOM BAR: PRICE + BUTTON */}
//                 <div className="flex items-center justify-between pt-6 border-t border-gray-100/50">
//                   <div>
//                     <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
//                       Starting from
//                     </p>
//                     <div className="flex items-baseline gap-1">
//                       <span className="text-2xl font-black text-gray-900">
//                         {property.list_price}
//                       </span>
//                       <span className="text-xs text-gray-600 font-medium">
//                         SAR/night
//                       </span>
//                     </div>
//                   </div>
//                   <button className="bg-gradient-to-r from-[#8B6D5C] to-[#A68A74] text-white px-8 py-3 rounded-[24px] font-semibold shadow-xl hover:from-[#765c4e] hover:shadow-2xl flex items-center gap-2 text-sm backdrop-blur-sm border transition-all duration-200">
//                     Check Availability
//                     <ArrowRight size={20} />
//                   </button>
//                 </div>
//               </div>
//             </article>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
