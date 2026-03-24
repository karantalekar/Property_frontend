"use client";
import { Phone, Mail, MapPin } from "lucide-react";
export default function Footer({ footer }: { footer: any }) {
  if (!footer) return null;

  return (
    <>
      <footer className="bg-[#82604d] rounded-b-2xl sm:rounded-b-[80px] md:rounded-b-[80px]   md:-mt-10 pb-0.5 sm:pb-5 md:pb-2">
        {/* Logo Section */}
        <div className="flex justify-center pt-2 sm:pt-2 md:pt-auto md:-mt-10">
          <img
            src={`https://beljumlah-11072023-28562543.dev.odoo.com${footer.company_logo}`}
            alt={footer.company_name}
            className="h-14 sm:h-18 md:h-24 lg:h-32 w-auto object-contain"
          />
        </div>

        {/* Main Content Card */}
        <div
          className="w-[90%] sm:w-[95%] md:w-[92%]
                  mx-auto
                  bg-[#F2F2F2]
                  rounded-2xl sm:rounded-3xl md:rounded-[50px]
                  px-4 sm:px-6 md:px-8 lg:px-16
                  py-6 sm:py-8 md:py-10 lg:py-14
                  grid grid-cols-1 md:grid-cols-3
                  gap-6 sm:gap-8 md:gap-10 lg:gap-16
                  mb-10 sm:mb-6"
        >
          {/* About Us Section */}
          <div className="text-left">
            <h3 className="text-lg sm:text-xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-black">
              About Us
            </h3>
            <p className="text-xs sm:text-sm md:text-xl text-gray-700 leading-6 sm:leading-7 md:leading-8">
              {footer.description}
            </p>
          </div>

          {/* Useful Links Section */}
          <div className="text-left md:text-center">
            <h3 className="text-lg sm:text-xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-8 text-black">
              Useful Links
            </h3>
            <ul className="space-y-2 sm:space-y-3 md:space-y-3 text-xs sm:text-sm md:text-xl flex flex-col items-start  md:ml-45">
              {footer.usefull_links?.map((link: any) => (
                <li key={link.id}>
                  <a
                    href={link.path}
                    className="text-black hover:text-[#C2A68C] transition duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="text-left md:text-left">
            <h3 className="text-lg sm:text-xl md:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-black">
              Contact Us
            </h3>

            <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-3 text-gray-700">
              {/* Phone */}
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone
                  size={20}
                  className="text-[#82604d] mt-0.5 flex-shrink-0 sm:w-5 md:w-5 cursor-pointer"
                />
                <p className="text-xs sm:text-sm md:text-xl break-all">
                  <a href={`tel:${footer.company_phone}`}>
                    {footer.company_phone}
                  </a>
                </p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail
                  size={20}
                  className="text-[#82604d] mt-0.5 flex-shrink-0 sm:w-5 md:w-5 cursor-pointer"
                />
                <p className="text-xs sm:text-sm md:text-xl break-all">
                  <a href={`mailto:${footer.company_email}`}>
                    {footer.company_email}
                  </a>
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 sm:gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    footer.company_address,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 cursor-pointer"
                >
                  <MapPin
                    size={20}
                    className="text-[#82604d] mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm md:text-xl">
                    {footer.company_address}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section - Outside Footer (Separate) */}
      <div className="bg-white px-4 sm:px-3 md:px-4 py-4 sm:py-5 md:py-3  border-gray-200">
        {/* <div className="text-center text-black text-xs sm:text-sm md:text-xl tracking-wide cursor-pointer">
          © 2026 {footer.company_name} Powered by Consociate Solutions
        </div> */}
        <div className="text-center text-black text-xs sm:text-sm md:text-xl tracking-wide">
          © 2026 {footer.company_name} Powered by{" "}
          <a
            href="https://consociatesolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-[#C9B59C] transition-colors "
          >
            Consociate Solutions
          </a>
        </div>
      </div>
    </>
  );
}
