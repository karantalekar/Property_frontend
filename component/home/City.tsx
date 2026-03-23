// "use client";

// import Image from "next/image";
// import { ArrowRight } from "lucide-react";
// import { useState, useEffect } from "react";
// import Link from "next/link";

// export default function City({ cities }: { cities: any[] }) {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if device is mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768); // md breakpoint
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Auto-advance carousel on mobile
//   useEffect(() => {
//     if (!isMobile || cities.length === 0) return;

//     const timer = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % cities.length);
//     }, 5000); // Change every 5 seconds

//     return () => clearInterval(timer);
//   }, [isMobile, cities.length]);

//   const handleDotClick = (index: number) => {
//     setCurrentIndex(index);
//   };

//   // Mobile slider view
//   if (isMobile && cities.length > 0) {
//     const currentCity = cities[currentIndex];

//     return (
//       <section className="py-12 px-6 bg-white ">
//         {/* Heading */}
//         <div className="flex items-center gap-6 mb-4 ">
//           <h2 className="text-2xl md:text-4xl text-gray-900 ">
//             Trending destinations
//           </h2>
//           <div className="flex-1 h-[2px] bg-gray-300"></div>
//         </div>

//         {/* Carousel Container */}
//         <div className="relative ">
//           {/* City Card */}
//           <div className="group cursor-pointer">
//             {/* Image */}
//             <div className="relative overflow-hidden rounded-2xl">
//               <Image
//                 src={`${baseUrl}${currentCity.image}`}
//                 alt={currentCity.name}
//                 width={600}
//                 height={350}
//                 className="w-full h-[200px] object-cover transition duration-300"
//               />
//             </div>

//             {/* City Info */}
//             <div className="flex justify-between items-center mt-4">
//               <h3 className="text-2xl font-semibold text-gray-900">
//                 {currentCity.name}
//               </h3>
//               <Link
//                 href={`/properties?city=${currentCity.id}`}
//                 className="bg-[#8B6A52] text-white p-3 rounded-full shadow-md hover:bg-[#745640] transition"
//               >
//                 <ArrowRight size={24} />
//               </Link>
//             </div>
//           </div>

//           {/* Dot Navigation */}
//           <div className="flex justify-center gap-2 mt-8">
//             {cities.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleDotClick(index)}
//                 className={`transition-all duration-300 rounded-full ${
//                   index === currentIndex
//                     ? "bg-[#8B6A52] w-3 h-3"
//                     : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>

//           {/* Slide Counter */}
//           {/* <div className="text-center mt-4 text-sm text-gray-500">
//             {currentIndex + 1} / {cities.length}
//           </div> */}
//         </div>
//       </section>
//     );
//   }

//   // Desktop grid view
//   return (
//     <section className="py-15 -mt-15 -ml-5 md:-ml-11 md:mt-1 px-6 lg:px-20 bg-white">
//       {/* Heading */}
//       <div className="flex items-center gap-6 mb-10">
//         <h2 className="text-5xl ml-5 text-gray-900">Trending destinations</h2>
//         <div className="flex-1 h-[2px] bg-gray-300"></div>
//       </div>

//       {/* Cities Grid */}
//       <div className="grid md:grid-cols-2 gap-4">
//         {cities?.map((city) => (
//           <div key={city.id} className="group cursor-pointer">
//             {/* Image */}
//             <div className="relative overflow-hidden ml-5 rounded-2xl">
//               <Image
//                 src={`${baseUrl}${city.image}`}
//                 alt={city.name}
//                 width={600}
//                 height={350}
//                 className="w-full h-[240px] object-cover transition duration-300 group-hover:scale-105"
//               />
//             </div>

//             <div className="flex justify-between items-center mt-5 mx-5">
//               <h3 className="text-2xl font-medium ml-5 text-black">
//                 {city.name}
//               </h3>

//               <Link
//                 href={`/properties?city=${city.id}`}
//                 className="bg-[#8B6A52] text-white p-3 rounded-full shadow-md hover:bg-[#745640] transition cursor-pointer"
//               >
//                 <ArrowRight size={25} />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function City({ cities }: { cities: any[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Touch/Swipe tracking
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile || cities.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cities.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [isMobile, cities.length]);

  // ✅ Handle touch start on image
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };

  // ✅ Handle touch move to prevent scrolling while swiping
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent vertical scroll while swiping horizontally
    const touch = e.touches[0];
    const diff = Math.abs(touch.clientX - touchStart);
    if (diff > 5) {
      e.preventDefault();
    }
  };

  // ✅ Handle touch end - detect swipe direction
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.changedTouches[0].clientX);

    const distance = touchStart - e.changedTouches[0].clientX;
    const threshold = 50; // minimum swipe distance in pixels

    // Swiped left - next slide
    if (distance > threshold) {
      setCurrentIndex((prev) => (prev + 1) % cities.length);
    }

    // Swiped right - previous slide
    if (distance < -threshold) {
      setCurrentIndex((prev) => (prev - 1 + cities.length) % cities.length);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + cities.length) % cities.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cities.length);
  };

  // Mobile slider view
  if (isMobile && cities.length > 0) {
    const currentCity = cities[currentIndex];

    return (
      <section className="py-12 px-6 bg-white ">
        {/* Heading */}
        <div className="flex items-center gap-6 mb-4 ">
          <h2 className="text-2xl md:text-4xl text-gray-900">
            Trending destinations
          </h2>
          <div className="flex-1 h-[2px] bg-gray-300"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* ✅ SWIPEABLE IMAGE SECTION */}
          <div
            ref={imageRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative overflow-hidden rounded-2xl touch-none select-none"
            style={{
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
          >
            <Image
              src={`${baseUrl}${currentCity.image}`}
              alt={currentCity.name}
              width={600}
              height={350}
              className="w-full h-[200px] object-cover transition duration-300 pointer-events-none"
              draggable={false}
              priority
            />
          </div>

          {/* City Info Below Image */}
          <div className="flex justify-between items-center mt-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              {currentCity.name}
            </h3>
            <Link
              href={`/properties?city=${currentCity.id}`}
              className="bg-[#8B6A52] text-white p-3 rounded-full shadow-md hover:bg-[#745640] transition"
            >
              <ArrowRight size={24} />
            </Link>
          </div>

          {/* Dot Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {cities.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "bg-[#8B6A52] w-3 h-3"
                    : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop grid view (unchanged)
  return (
    <section className="py-15 -mt-15 -ml-5 md:-ml-11 md:mt-1 px-6 lg:px-20 bg-white">
      {/* Heading */}
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-5xl ml-5 text-gray-900">Trending destinations</h2>
        <div className="flex-1 h-[2px] bg-gray-300"></div>
      </div>

      {/* Cities Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {cities?.map((city) => (
          <div key={city.id} className="group cursor-pointer">
            {/* Image */}
            <div className="relative overflow-hidden ml-5 rounded-2xl">
              <Image
                src={`${baseUrl}${city.image}`}
                alt={city.name}
                width={600}
                height={350}
                className="w-full h-[240px] object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex justify-between items-center mt-5 mx-5">
              <h3 className="text-2xl font-medium ml-5 text-black">
                {city.name}
              </h3>

              <Link
                href={`/properties?city=${city.id}`}
                className="bg-[#8B6A52] text-white p-3 rounded-full shadow-md hover:bg-[#745640] transition cursor-pointer"
              >
                <ArrowRight size={25} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
