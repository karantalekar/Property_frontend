// export default function Feature({ featureData }: { featureData: any }) {
//   if (!featureData || !featureData.is_active) return null;

//   const baseUrl = "https://beljumlah-11072023-28562543.dev.odoo.com";

//   const subSections = featureData.sub_sections || [];
//   const f1 = subSections[0] || {};
//   const f2 = subSections[1] || {};

//   return (
//     <section className="w-full py-5 md:py-10 bg-white overflow-hidden">
//       <div className="w-full px-6 md:px-12">
//         {/* 1. Header Row */}
//         <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-5">
//           <h2 className="text-3xl md:text-5xl max-w-xl leading-[1.1] text-gray-900 tracking-tight">
//             {featureData.heading}
//           </h2>
//           <div className="flex items-center gap-3 -mr-4 w-full md:max-w-2xl md:mt-auto">
//             <img
//               src={`${baseUrl}${featureData.image}`}
//               className="w-20 h-25 md:w-25 md:h-25 object-contain shrink-0"
//               alt="Section Icon"
//             />
//             <p className="text-gray-600 text-xl md:text-3xl -mb-2 leading-snug">
//               {featureData.description}
//             </p>
//           </div>
//         </div>

//         {/* 2. Main Bento Grid */}
//         <div className="grid grid-cols-1 -mt-5 md:grid-cols-12 gap-6 md:auto-rows-[250px]">
//           {/* Left Large Image */}
//           <div className="md:col-span-6 md:row-span-2 rounded-2xl overflow-hidden shadow-sm h-[450px] md:h-[110%]  relative">
//             <img
//               src={`${baseUrl}${f1.image}`}
//               className="absolute inset-0 w-full h-full object-cover"
//               alt="Main Interior"
//             />
//           </div>

//           {/* Middle Tan Info Card */}
//           <div className="md:col-span-3 md:row-span-2 bg-[#edd6ad] rounded-2xl md:w-[100%] p-8 md:p-15 md:h-115 h-78 flex flex-col justify-center items-center text-center">
//             <h3 className="text-2xl md:text-4xl mb-2 leading-tight text-gray-900">
//               {f1.heading}
//             </h3>
//             <p className="text-gray-700 md:text-2xl md:mb-5 mb-2 leading-relaxed">
//               {f1.description}
//             </p>
//             {f1.button_text_1 && (
//               <a
//                 href={f1.button_url_1}
//                 className="bg-white text-black md:px-13 py-1 px-4 md:text-xl text-lg md:mt-5 md:py-3.5 rounded-lg shadow-sm transition-all active:scale-95 hover:bg-[#E6D9C3] border-amber-50 border"
//               >
//                 {f1.button_text_1}
//               </a>
//             )}
//           </div>

//           {/* Top Right Small Image — removed md:ml-20, let it fill the column */}
//           <div className="md:col-span-3 md:row-span-1 rounded-2xl overflow-hidden h-[200px] md:h-[90%] relative">
//             <img
//               src={`${baseUrl}${f2.image}`}
//               className="absolute inset-0 w-full h-full object-cover"
//               alt="Secondary Interior"
//             />
//           </div>

//           {/* Bottom Right Cocoa Card — removed hardcoded md:h-50, fills row naturally */}
//           <div className="md:col-span-3 md:row-span-1 bg-[#8B6E5B] rounded-2xl p-8 md:-mt-5 flex md:h-50 items-center justify-center text-center">
//             <h3 className="text-2xl md:text-4xl font-medium text-white leading-tight">
//               {f2.heading}
//             </h3>
//           </div>
//         </div>

//         {/* 3. Bottom Footer Text — removed negative margin, sits naturally below grid */}
//         <div className="md:-mt-10 md:ml-10 grid grid-cols-1 md:grid-cols-12 mt-5">
//           <div className="md:col-start-7 md:col-span-6">
//             <p className="text-gray-500 text-lg md:text-2xl leading-relaxed items-center">
//               {f2.description}
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function Feature({ featureData }: { featureData: any }) {
  if (!featureData || !featureData.is_active) return null;

  const baseUrl = "https://beljumlah-11072023-28562543.dev.odoo.com";

  const subSections = featureData.sub_sections || [];
  const f1 = subSections[0] || {};
  const f2 = subSections[1] || {};

  return (
    <section className="w-full py-5 md:py-10 bg-white overflow-hidden md:-mt-8 md:-mb-12 ">
      <div className="container mx-auto px-6 lg:px-0">
        {/* 1. Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-5 ">
          <h2 className="text-3xl md:text-5xl max-w-xl leading-[1.1] text-gray-900 tracking-tight">
            {featureData.heading}
          </h2>
          <div className="flex items-center gap-3 w-full md:max-w-2xl md:mt-auto">
            <img
              src={`${baseUrl}${featureData.image}`}
              className="w-20 h-25 md:w-25 md:h-25 object-contain shrink-0"
              alt="Section Icon"
            />
            <p className="text-gray-600 text-xl md:text-3xl -mb-2 leading-snug">
              {featureData.description}
            </p>
          </div>
        </div>

        {/* 2. Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[250px] md:-mt-4">
          {/* Left Large Image */}
          <div className="md:col-span-6 md:row-span-2 rounded-2xl overflow-hidden shadow-sm h-[450px] md:h-[105%] relative -mt-5">
            <img
              src={`${baseUrl}${f1.image}`}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Main Interior"
            />
          </div>

          {/* Middle Tan Info Card */}
          <div className="md:col-span-3 md:-mt-5 md:row-span-2 bg-[#edd6ad] rounded-2xl p-8 md:p-12 h-78 md:h-115 flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl md:text-4xl mb-2 leading-tight text-gray-900">
              {f1.heading}
            </h3>
            <p className="text-gray-700 md:text-2xl md:mb-2 mb-2 leading-relaxed">
              {f1.description}
            </p>
            {f1.button_text_1 && (
              <a
                href={f1.button_url_1}
                className="bg-white text-black md:px-10 py-1 px-4 md:text-xl text-lg  md:py-3.5 rounded-lg shadow-sm transition-all active:scale-95 hover:bg-[#E6D9C3] border-amber-50 border"
              >
                {f1.button_text_1}
              </a>
            )}
          </div>

          {/* Top Right Small Image */}
          <div className="md:col-span-3 md:row-span-1 md:-mt-5 rounded-2xl overflow-hidden h-[200px] md:h-[90%] relative">
            <img
              src={`${baseUrl}${f2.image}`}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Secondary Interior"
            />
          </div>

          {/* Bottom Right Cocoa Card */}
          <div className="md:col-span-3 md:row-span-1 bg-[#8B6E5B] rounded-2xl p-4 md:h-50 md:-mt-10 flex items-center justify-center text-center">
            <h3 className="text-2xl md:text-4xl font-medium text-white leading-tight">
              {f2.heading}
            </h3>
          </div>
        </div>

        {/* 3. Bottom Footer Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:-mt-16 md:ml-6">
          <div className="md:col-start-7 md:col-span-6">
            <p className="text-gray-500 text-lg md:text-2xl leading-relaxed">
              {f2.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
