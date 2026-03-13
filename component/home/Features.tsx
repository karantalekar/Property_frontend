export default function Feature({ featureData }: { featureData: any }) {
  if (!featureData || !featureData.is_active) return null;

  const baseUrl = "https://beljumlah-11072023-28562543.dev.odoo.com";

  // Safely access sub_sections
  const subSections = featureData.sub_sections || [];
  const f1 = subSections[0] || {};
  const f2 = subSections[1] || {};

  return (
    <section className="py-16 md:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* 1. Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-5">
          <h2 className="text-4xl md:text-5xl font-medium max-w-xl leading-[1.1] text-gray-900 tracking-tight">
            {featureData.heading}
          </h2>

          <div className="flex items-center gap-6 w-full md:max-w-2xl md:mt-auto">
            <img
              src={`${baseUrl}${featureData.image}`}
              className="w-16 h-16 md:w-26 md:h-26 object-contain shrink-0"
              alt="Section Icon"
            />
            <p className="text-gray-600 text-medium md:text-3xl  leading-snug">
              {/* Removed line-clamp and text-3xl to allow all words to fit in two rows */}
              {featureData.description}
            </p>
          </div>
        </div>

        {/* 2. Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[300px]">
          {/* Left Large Image - FIXED: Using f1.image which worked in your old code */}
          <div className="md:col-span-6 md:row-span-2 rounded-[2.5rem] overflow-hidden shadow-sm h-[400px] md:h-full relative">
            <img
              src={`${baseUrl}${f1.image}`}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Main Interior"
            />
          </div>

          {/* Middle Tan Info Card (F1) */}
          <div className="md:col-span-3 md:row-span-2 bg-[#E6D9C3] rounded-[2.5rem] p-8 md:p-15 h-130 flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl md:text-4xl font-medium mb-6 leading-tight text-gray-900">
              {f1.heading}
            </h3>
            <p className="text-gray-700 text-base md:text-lg mb-5 leading-relaxed">
              {f1.description}
            </p>
            {f1.button_text_1 && (
              <a
                href={f1.button_url_1}
                className="bg-white text-black px-10 py-3.5 rounded-lg md:font-2xl shadow-sm  transition-all active:scale-95 hover:bg-[#E6D9C3]  border-amber-50 border"
              >
                {f1.button_text_1}
              </a>
            )}
          </div>

          {/* Top Right Small Image (Also using f1.image to match your old logic) */}
          <div className="md:col-span-3 md:row-span-1 rounded-[2.5rem] overflow-hidden h-[200px] md:h-full relative">
            <img
              src={`${baseUrl}${f2.image}`} // Fallback to f1.image if f2.image is missing
              className="absolute inset-0 w-full h-full object-cover"
              alt="Secondary Interior"
            />
          </div>

          {/* Bottom Right Cocoa Card (F2) */}
          <div className="md:col-span-3 md:row-span-0 bg-[#8B6E5B] rounded-[2.5rem] p-8 flex items-center justify-center text-center md:h-50">
            <h3 className="text-2xl md:text-4xl font-medium text-white leading-tight">
              {f2.heading}
            </h3>
          </div>
        </div>

        {/* 3. Bottom Footer Text */}
        <div className="mt-4 md:-mt-15 grid grid-cols-1 md:grid-cols-12 relative z-5">
          <div className="md:col-start-7 md:col-span-6">
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
              {f2.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
