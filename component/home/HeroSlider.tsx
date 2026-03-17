// "use client";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function HeroSlider({ banners }: { banners: any[] }) {
//   const [index, setIndex] = useState(0);
//   const baseUrl = "https://beljumlah-11072023-28562543.dev.odoo.com";

//   useEffect(() => {
//     if (!banners || banners.length <= 1) return;

//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % banners.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, [banners]);

//   if (!banners || banners.length === 0) return null;

//   const current = banners[index];

//   return (
//     // <section className="relative w-full h-[60vh] md:h-screen bg-black overflow-hidden">
//     <section className="relative w-full h-[65vh] sm:h-[80vh] md:h-screen bg-black overflow-hidden">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={current.id}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.8 }}
//           className="absolute inset-0 z-0 w-full h-full"
//         >
//           {/* Background Image */}
//           <div
//             className="absolute inset-0 w-full md:w-full h-full  md:h-full md:bg-cover bg-contain bg-center  bg-no-repeat transition-all duration-700"
//             style={{ backgroundImage: `url('${baseUrl}${current.image}')` }}
//           />

//           {/* Content */}
//           <div className="relative z-10 h-full flex items-center justify-center text-center px-4 md:px-6">
//             <div className="max-w-4xl">
//               <h1 className="text-3xl md:text-5xl font-xl text-white mb-4 md:mb-6 leading-tight">
//                 {current.heading}
//               </h1>

//               <p className="text-sm md:text-2xl text-gray-200 mb-6 md:mb-10 max-w-2xl mx-auto line-clamp-3 md:line-clamp-none">
//                 {current.description}
//               </p>

//               <a
//                 href={current.btn_link}
//                 className="inline-block bg-white text-black px-8 py-3 md:px-10 md:py-4 rounded-lg md:rounded-xl text-sm md:text-lg font-medium border border-white hover:bg-transparent hover:text-white transition-all"
//               >
//                 {current.btn_text}
//               </a>
//             </div>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </section>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSlider({ banners }: { banners: any[] }) {
  const [index, setIndex] = useState(0);
  const baseUrl = "https://beljumlah-11072023-28562543.dev.odoo.com";

  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const current = banners[index];

  return (
    <section className="relative w-full h-[60vh] sm:h-[80vh] md:h-[78vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0 w-full h-full"
        >
          {/* Background Image - Adjusted for Mobile */}
          <div
            className="absolute inset-0 w-full h-full bg-cover sm:bg-contain md:bg-cover bg-center bg-no-repeat transition-all duration-700"
            style={{
              backgroundImage: `url('${baseUrl}${current.image}')`,
              backgroundColor: "#000",
              backgroundSize: "cover",
            }}
          />

          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/30 z-5"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-3 sm:px-4 md:px-6">
            <div className="max-w-4xl w-full">
              {/* Heading - Responsive */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                {current.heading}
              </h1>

              {/* Description - Responsive */}
              <p className="text-xs sm:text-sm md:text-2xl text-gray-200 mb-4 sm:mb-6 md:mb-10 max-w-2xl mx-auto line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                {current.description}
              </p>

              {/* Button - Responsive */}
              <a
                href={current.btn_link}
                className="inline-block bg-white text-black px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 md:py-4 rounded-lg md:rounded-xl text-xs sm:text-sm md:text-base md:text-lg font-medium border border-white hover:bg-transparent hover:text-white transition-all active:scale-95"
              >
                {current.btn_text}
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
