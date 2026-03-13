// "use client";

// import { useEffect, useState } from "react";
// import { sendContactData, getFooterData } from "@/API/home";
// import toast from "react-hot-toast";
// export default function ContactForm({ gallery }: any) {
//   const [footerData, setFooterData] = useState<any>(null);

//   useEffect(() => {
//     const fetchFooter = async () => {
//       try {
//         const data = await getFooterData();
//         setFooterData(data);
//       } catch (err) {
//         console.error("Footer fetch error:", err);
//       }
//     };

//     fetchFooter();
//   }, []);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);

//     const name = formData.get("name")?.toString() || "";
//     const phone = formData.get("phone")?.toString() || "";
//     const email = formData.get("email")?.toString() || "";
//     const message = formData.get("message")?.toString() || "";

//     try {
//       await sendContactData({
//         name,
//         phone,
//         email,
//         message,
//       });

//       toast.success("Message sent successfully!");
//       e.target.reset();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send message.");
//     }
//   };
//   return (
//     <div className="space-y-8">
//       {/* Text */}
//       <div className="text-center space-y-4">
//         <p className="text-xl text-amber-800">{gallery?.heading}</p>

//         <h2 className="text-5xl font-light text-gray-900">
//           {gallery?.sub_heading}
//         </h2>

//         <p className="text-gray-600 max-w-2xl mx-auto">
//           {gallery?.description}
//         </p>
//       </div>

//       {/* Form */}
//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           className="w-full p-6 border border-gray-300 rounded-lg text-black bg-white/90"
//         />

//         <input
//           type="tel"
//           name="phone"
//           placeholder="Phone"
//           className="w-full p-6 border border-gray-300 rounded-lg text-black bg-white/90"
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="w-full p-6 border border-gray-300 rounded-lg text-black bg-white/90"
//         />

//         <textarea
//           name="message"
//           placeholder="Write message here"
//           rows={6}
//           className="w-full md:p-6 p-5 border border-gray-300 rounded-lg text-black bg-white/90"
//         />

//         <button className="w-full bg-[#6F4E37] text-white py-6  rounded-xl tracking-widest text-lg hover:bg-amber-900 transition">
//           Send Your Message
//         </button>
//       </form>

//       {/* Direct Reservation */}
//       <div className="bg-[#FFFBF1] p-6 border-4 h-80 font-extralight">
//         <h3 className="text-black md:text-4xl text-lg mb-4 text-center">
//           Direct Reservations
//         </h3>

//         <p className="text-xl text-gray-700 text-center">
//           Address: {footerData?.company_address}
//         </p>

//         <p className="text-xl text-gray-700 mt-3 text-center">
//           Phone:
//           <a
//             href={`tel:${footerData?.company_phone}`}
//             className="ml-2 hover:underline"
//           >
//             {footerData?.company_phone}
//           </a>
//         </p>

//         <p className="text-xl text-gray-700 mt-3 text-center">
//           Email:
//           <a
//             href={`mailto:${footerData?.company_email}`}
//             className="ml-2 hover:underline"
//           >
//             {footerData?.company_email}
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { sendContactData, getFooterData } from "@/API/home";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactForm({ gallery }: any) {
  const [footerData, setFooterData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooterData();
        setFooterData(data);
      } catch (err) {
        console.error("Footer fetch error:", err);
      }
    };

    fetchFooter();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    const name = formData.get("name")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    try {
      await sendContactData({
        name,
        phone,
        email,
        message,
      });

      toast.success("Message sent successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-0">
      {/* Text Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <p className="text-base sm:text-lg md:text-xl text-amber-800 font-medium">
          {gallery?.heading}
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-tight">
          {gallery?.sub_heading}
        </h2>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
          {gallery?.description}
        </p>
      </div>

      {/* Form Section */}
      <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full p-4 sm:p-5 md:p-6 border border-gray-300 rounded-lg text-black bg-white/90 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          className="w-full p-4 sm:p-5 md:p-6 border border-gray-300 rounded-lg text-black bg-white/90 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-4 sm:p-5 md:p-6 border border-gray-300 rounded-lg text-black bg-white/90 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
        />

        <textarea
          name="message"
          placeholder="Write message here"
          rows={5}
          required
          className="w-full p-4 sm:p-5 md:p-6 border border-gray-300 rounded-lg text-black bg-white/90 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600 transition resize-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#6F4E37] text-white py-4 sm:py-5 md:py-6 rounded-xl tracking-widest text-sm sm:text-base md:text-lg font-semibold hover:bg-amber-900 transition disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
        >
          {isSubmitting ? "Sending..." : "Send Your Message"}
        </button>
      </form>

      {/* Direct Reservation Section */}
      <div className="bg-[#FFFBF1] p-4 sm:p-6 md:p-8 border-2 sm:border-4 rounded-xl space-y-4 sm:space-y-6">
        <h3 className="text-xl sm:text-2xl md:text-4xl font-light text-black text-center">
          Direct Reservations
        </h3>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Address */}
          <div className="flex flex-col items-center sm:items-start gap-3 p-4 sm:p-0 border-b sm:border-b-0 sm:border-r border-amber-200 last:border-b-0 sm:last:border-r-0 pb-4 sm:pb-0 sm:pr-6">
            <MapPin size={24} className="text-amber-800 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                Address
              </p>
              <p className="text-sm sm:text-base text-gray-700 font-light leading-relaxed">
                {footerData?.company_address}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center sm:items-start gap-3 p-4 sm:p-0 border-b sm:border-b-0 sm:border-r border-amber-200 last:border-b-0 sm:last:border-r-0 pb-4 sm:pb-0 sm:px-6">
            <Phone size={24} className="text-amber-800 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                Phone
              </p>
              <a
                href={`tel:${footerData?.company_phone}`}
                className="text-sm sm:text-base text-gray-700 font-light hover:text-amber-800 hover:underline transition"
              >
                {footerData?.company_phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center sm:items-start gap-3 p-4 sm:p-0 pb-0">
            <Mail size={24} className="text-amber-800 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                Email
              </p>
              <a
                href={`mailto:${footerData?.company_email}`}
                className="text-sm sm:text-base text-gray-700 font-light hover:text-amber-800 hover:underline transition break-all"
              >
                {footerData?.company_email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
