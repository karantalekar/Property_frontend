"use client";

const Booking_Steps = ({ data }: { data: any }) => {
  const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

  if (!data || !data.sub_sections || !data.is_active) {
    return null;
  }

  return (
    <div className="w-full bg-white ">
      {/* --- Heading Wrapper (NO BACKGROUND COLOR) --- */}
      <div className="w-full pt-10 pb-6">
        {/* Using max-w-[1600px] to match your content width */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-left">
          <h2 className="text-2xl md:text-5xl text-gray-900 md:-ml-50 -mt-10">
            {data.heading || "Booking Steps"}
          </h2>
        </div>
      </div>

      {/* --- Content Section (BACKGROUND COLOR STARTS HERE) --- */}
      <section className="bg-[#FCF9EA] py-15 overflow-hidden">
        <div className="max-w-[1650px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-8">
            {data.sub_sections.map((step: any, index: number) => {
              if (!step) return null;

              return (
                <div
                  key={step.id || index}
                  className="flex-1 flex flex-col items-center group relative w-full"
                >
                  <div className="relative z-10 mb-10">
                    {/* Step Icon Circle */}
                    <div className="w-40 h-40 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center p-10 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                      {step.image ? (
                        <img
                          src={`${BASE_URL}${step.image}`}
                          alt={step.heading || "booking step"}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* --- IMAGE CONNECTOR LOGIC --- */}
                    {index < data.sub_sections.length - 1 && (
                      <>
                        <div className="hidden lg:block absolute top-12 left-[95%] w-[100%] h-20 pointer-events-none z-0">
                          <img
                            src="/Vector 2.png"
                            alt="next step"
                            className="w-full h-full object-contain opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>

                        {/* Mobile Vertical Divider */}
                        <div className="lg:hidden absolute top-[160px] left-1/2 -translate-x-1/2 h-20 w-0 border-l-2 border-dotted border-amber-900/20" />
                      </>
                    )}
                  </div>

                  {/* Text Description */}
                  <div className="text-center px-4 max-w-sm">
                    <h3 className="text-2xl  text-gray-900 mb-4  tracking-tight">
                      {step.heading}
                    </h3>
                    <p className="text-gray-900 text-lg font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking_Steps;
