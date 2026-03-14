// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import { getHomeData } from "@/API/home";
// import { sendRegisterData } from "@/API/loginregister";
// import { setTempEmail } from "@/redux/slices/authSlice";
// import toast from "react-hot-toast";

// export default function RegisterForm() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [bannerImage, setBannerImage] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   // ============================================
//   // FETCH BANNER DATA
//   // ============================================

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getHomeData();
//         const imagePath = data?.banner?.banner?.[0]?.image;

//         if (imagePath) {
//           const bannerUrl =
//             "https://beljumlah-11072023-28562543.dev.odoo.com" + imagePath;
//           setBannerImage(bannerUrl);
//         }
//       } catch (error) {
//         console.error("Failed to fetch banner:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // ============================================
//   // FORM SUBMIT HANDLER
//   // ============================================

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Validate email
//     if (!email.trim()) {
//       toast.error("Please enter your email");
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error("Please enter a valid email");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log("📧 Sending registration OTP to:", email);

//       const result = await sendRegisterData({ email: email.trim() });

//       console.log("📨 Registration Response:", result);

//       if (result?.status) {
//         toast.success("OTP sent successfully!");

//         // ✅ Store email in Redux for the next page
//         dispatch(setTempEmail(email.trim()));

//         // ✅ Redirect to OTP verification page with email in URL
//         router.push(`/register/otp?email=${encodeURIComponent(email.trim())}`);
//       } else {
//         // Handle existing user or other errors
//         toast.error(result?.message || "Failed to send OTP");

//         // If user already exists, redirect to login
//         if (
//           result?.message &&
//           result.message.toLowerCase().includes("already")
//         ) {
//           setTimeout(() => router.push("/login"), 2000);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Register error:", error);
//       toast.error("Failed to send OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ============================================
//   // RENDER
//   // ============================================

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         {bannerImage && (
//           <>
//             <img
//               src={bannerImage}
//               alt="Background"
//               className="absolute inset-0 w-full h-full object-cover"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).style.display = "none";
//               }}
//             />
//             <div className="absolute inset-0 bg-black/60"></div>
//           </>
//         )}
//         {!bannerImage && (
//           <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
//         )}
//       </div>

//       {/* Outer Brown Card */}
//       <div className="relative z-10 bg-[#8b6a57] p-6 rounded-2xl shadow-xl">
//         {/* Inner White Card */}
//         <div className="bg-white w-[360px] rounded-xl p-8">
//           <h2 className="text-center text-xl font-semibold text-gray-800">
//             Sign Up
//           </h2>

//           <div className="border-b border-black mt-3 mb-5"></div>

//           <p className="text-center text-lg text-gray-500 mb-6">
//             Welcome to{" "}
//             <span className="text-[#8b6a57] font-semibold">Regent Grove</span>
//           </p>

//           {/* Form */}
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* Email Input */}
//             <div>
//               <label className="text-sm font-semibold text-gray-600">
//                 Email address *
//               </label>

//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isLoading}
//                 className="w-full mt-2 text-black px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-[#8b6a57] focus:ring-2 focus:ring-[#8b6a57]/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#8b6a57] text-white py-2.5 rounded-md font-medium hover:bg-[#7a5d4c] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   Sending OTP...
//                 </>
//               ) : (
//                 "Send OTP"
//               )}
//             </button>
//           </form>

//           {/* Help Text */}
//           <p className="text-xs text-gray-500 text-center mt-4">
//             We'll send a 6-digit code to your email address
//           </p>
//         </div>

//         {/* Login Link */}
//         <p className="text-center text-sm text-white mt-6">
//           Already have an account?{" "}
//           <span
//             className="font-semibold cursor-pointer hover:text-gray-200 transition"
//             onClick={() => router.push("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getHomeData } from "@/API/home";
import { sendRegisterData } from "@/API/loginregister";
import { setTempEmail } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [bannerImage, setBannerImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ============================================
  // FETCH BANNER DATA
  // ============================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        const imagePath = data?.banner?.banner?.[0]?.image;

        if (imagePath) {
          const bannerUrl =
            "https://beljumlah-11072023-28562543.dev.odoo.com" + imagePath;
          setBannerImage(bannerUrl);
        }
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    };

    fetchData();
  }, []);

  // ============================================
  // FORM SUBMIT HANDLER
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📧 Sending registration OTP to:", email);

      const result = await sendRegisterData({ email: email.trim() });

      console.log("📨 Registration Response:", result);

      if (result?.status) {
        toast.success("OTP sent successfully!");

        // ✅ Store email in Redux for the next page
        dispatch(setTempEmail(email.trim()));

        // ✅ Redirect to OTP verification page with email in URL
        router.push(`/register/otp?email=${encodeURIComponent(email.trim())}`);
      } else {
        // Handle existing user or other errors
        toast.error(result?.message || "Failed to send OTP");

        // If user already exists, redirect to login
        if (
          result?.message &&
          result.message.toLowerCase().includes("already")
        ) {
          setTimeout(() => router.push("/login"), 2000);
        }
      }
    } catch (error) {
      console.error("❌ Register error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {bannerImage && (
          <>
            <img
              src={bannerImage}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </>
        )}
        {!bannerImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        )}
      </div>

      {/* Outer Brown Card - Responsive */}
      <div className="relative z-10 bg-[#8b6a57] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        {/* Inner White Card - Responsive */}
        <div className="bg-white w-full rounded-xl p-5 sm:p-6 md:p-8">
          <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Sign Up
          </h2>

          <div className="border-b border-black mt-3 mb-4 sm:mb-5"></div>

          <p className="text-center text-base sm:text-lg md:text-lg text-gray-500 mb-6 sm:mb-8">
            Welcome to{" "}
            <span className="text-[#8b6a57] font-semibold">Regent Grove</span>
          </p>

          {/* Form */}
          <form
            className="space-y-4 sm:space-y-5 md:space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Email Input */}
            <div>
              <label className="text-xs sm:text-sm md:text-sm font-semibold text-gray-600">
                Email address *
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full text-black text-sm sm:text-base mt-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md outline-none focus:border-[#8b6a57] focus:ring-2 focus:ring-[#8b6a57]/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8b6a57] text-white py-2 sm:py-2.5 md:py-3 rounded-md font-medium text-sm sm:text-base hover:bg-[#7a5d4c] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-xs sm:text-sm">Sending OTP...</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">Send OTP</span>
              )}
            </button>
          </form>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4 md:mt-5">
            We'll send a 6-digit code to your email address
          </p>
        </div>

        {/* Login Link - Responsive */}
        <p className="text-center text-xs sm:text-sm md:text-sm text-white mt-4 sm:mt-6">
          Already have an account?{" "}
          <span
            className="font-semibold cursor-pointer hover:text-gray-200 transition"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
