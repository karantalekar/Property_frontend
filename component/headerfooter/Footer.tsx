"use client";
import { Phone, Mail, MapPin } from "lucide-react";
export default function Footer({ footer }: { footer: any }) {
  if (!footer) return null;

  return (
    <footer className="bg-[#82604d] rounded-b-[80px] md:rounded-b-[130px] ">
      <div className="flex justify-center">
        <img
          src={`https://beljumlah-11072023-28562543.dev.odoo.com${footer.company_logo}`}
          alt={footer.company_name}
          className="h-20 md:h-28 w-auto"
        />
      </div>
      <div
        className="w-[92%] sm:w-[95%]
                lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1700px]
                mx-auto
                bg-[#F2F2F2]
                rounded-[30px] md:rounded-[50px]
                px-5 sm:px-8 md:px-16
                py-8 md:py-14
                grid grid-cols-1 md:grid-cols-3
                gap-6 md:gap-16
                mb-5"
      >
        <div className="text-left md:text-left">
          <h3 className="text-2xl font-semibold mb-6 text-black">About Us</h3>
          <p className="text-gray-700 leading-8 md:text-lg">
            {footer.description}
          </p>
        </div>

        <div className="text-left md:text-center">
          <h3 className="text-2xl font-semibold mb-8 text-black">
            Useful Links
          </h3>
          {/* <ul className="space-y-2 text-lg items-start"> */}
          <ul className="space-y-4 md:ml-40 md:space-y-3 text-base md:text-lg flex flex-col items-left md:items-start">
            {footer.usefull_links?.map((link: any) => (
              <li key={link.id}>
                <a
                  href={link.path}
                  className="text-gray-700 md:hover:text-[#C2A68C] hover:text-[#C2A68C] transition duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-left md:text-left">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-black">
            Contact Us
          </h3>

          <div className="flex flex-col space-y-3 text-gray-700 text-lg">
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-[#] mt-1 shrink-0" />
              <p className="text-base md:text-lg">{footer.company_phone}</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-[#] mt-1 shrink-0" />
              <p className="break-all text-base md:text-lg">
                {footer.company_email}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#] mt-1 shrink-0" />
              <p className="text-base md:text-lg">{footer.company_address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-700 mt-10 mb-2 p-5 text-base tracking-wide bg-white md:text-lg">
        © 2026 {footer.company_name} Powered by Consociate Solutions
      </div>
    </footer>
  );
}
