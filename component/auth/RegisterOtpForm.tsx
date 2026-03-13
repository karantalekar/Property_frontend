// "use client";

// import { useState, useRef, useEffect } from "react";
// import { getHomeData } from "@/API/home";
// import { verifyOtpData } from "@/API/loginregister";
// import UpdateUserForm from "@/component/auth/UpdateUserForm";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// export default function RegisterOtpForm({
//   email: propEmail,
// }: {
//   email?: string;
// }) {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [email, setEmail] = useState("");
//   const [data, setData] = useState<any>(null);
//   const inputs = useRef<(HTMLInputElement | null)[]>([]);
//   const router = useRouter();
//   const [showUpdateForm, setShowUpdateForm] = useState(false);

//   // Fetch banner
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await getHomeData();
//       setData(result);
//     };
//     fetchData();
//   }, []);

//   const bannerImage =
//     "https://beljumlah-11072023-28562543.dev.odoo.com" +
//     data?.banner?.banner?.[0]?.image;

//   // ✅ FIXED: Load email from prop → sessionStorage → URL
//   useEffect(() => {
//     let finalEmail = propEmail;
//     if (!finalEmail) {
//       const storedEmail = sessionStorage.getItem("email");
//       finalEmail = storedEmail || undefined;
//     }
//     if (!finalEmail) {
//       const urlParams = new URLSearchParams(window.location.search);
//       finalEmail = urlParams.get("email");
//     }

//     if (finalEmail) {
//       setEmail(finalEmail);
//       sessionStorage.setItem("emailForOtp", finalEmail);
//     }
//   }, [propEmail]);

//   // Auto focus first input
//   useEffect(() => {
//     inputs.current[0]?.focus();
//   }, []);

//   const handleChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && index < otp.length - 1) inputs.current[index + 1]?.focus();
//   };

//   // ✅ FIXED: Correct success flow
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const otpCode = otp.join("");

//     if (!email) return toast.error("Email not found.");

//     // try {
//     //   await verifyOtpData({ email, otp: otpCode });
//     //   toast.success("OTP Verified Successfully!");

//     //   // ✅ Store email and show Update form
//     //   sessionStorage.setItem("profileEmail", email);
//     //   setShowUpdateForm(true); // Show UpdateUserForm
//     // } catch (error) {
//     //   toast.error("Invalid OTP");
//     // }
//     // In RegisterOtpForm handleSubmit - AFTER verifyOtpData success:
//     try {
//       const result = await verifyOtpData({ email, otp: otpCode });

//       if (result?.status) {
//         // ✅ STORE ALL BACKEND DATA
//         sessionStorage.setItem("profileEmail", email);
//         sessionStorage.setItem("auth_token", result.auth_token);
//         sessionStorage.setItem("userData", JSON.stringify(result)); // Full user object

//         toast.success("OTP Verified!");
//         setShowUpdateForm(true);
//       }
//     } catch (error) {
//       toast.error("Invalid OTP");
//     }
//   };

//   // ✅ FIXED: Conditional render
//   if (showUpdateForm) {
//     return <UpdateUserForm />;
//   }

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       {/* Background */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
//       >
//         <div className="absolute inset-0 bg-black/60"></div>
//       </div>

//       {/* Card */}
//       <div className="relative z-10 bg-[#8b6a57] p-4 rounded-2xl shadow-xl">
//         <div className="bg-white w-[380px] rounded-xl p-8 text-center">
//           <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
//           <div className="border-b border-gray-300 mt-3 mb-5"></div>

//           <p className="text-lg text-gray-600 mb-1">Enter the code sent to</p>
//           <p className="text-lg font-medium text-[#8b6a57] mb-5">{email}</p>
//           <p className="text-sm text-gray-500 mb-4">
//             We have sent a 6-digit code to your email.
//           </p>

//           {/* ✅ FIXED: Added form wrapper */}
//           <form onSubmit={handleSubmit}>
//             {/* OTP Inputs */}
//             <div className="flex justify-center gap-3 mb-6">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (inputs.current[index] = el)}
//                   type="text"
//                   value={digit}
//                   maxLength={1}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   className="w-12 h-12 text-center text-black text-lg border rounded-md border-black focus:border-[#8b6a57] outline-none"
//                 />
//               ))}
//             </div>

//             {/* ✅ FIXED: Buttons inside form */}
//             <div className="flex gap-3 justify-center">
//               <button
//                 type="button"
//                 onClick={() => router.push("/register")}
//                 className="px-4 py-2 border rounded-md text-black hover:bg-gray-100"
//               >
//                 Change Email
//               </button>
//               {/* ✅ FIXED: type="submit" instead of onClick */}
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-[#8b6a57] text-white rounded-md hover:bg-[#755444]"
//               >
//                 Verify
//               </button>
//             </div>
//           </form>

//           <p className="text-xs text-[#8b6a57] mt-5">Resend in 0:55</p>
//         </div>

//         <p className="text-center text-sm text-white mt-6">
//           Already have an account?{" "}
//           <span
//             className="font-semibold cursor-pointer"
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

import { useState, useRef, useEffect } from "react";
import { getHomeData } from "@/API/home";
import { verifyOtpData } from "@/API/loginregister";
import UpdateUserForm from "@/component/auth/UpdateUserForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface VerifyOtpResponse {
  status: boolean;
  auth_token: string;
  [key: string]: any;
}

interface RegisterOtpFormProps {
  email?: string;
}

// ============================================
// COMPONENT
// ============================================

export default function RegisterOtpForm({
  email: propEmail,
}: RegisterOtpFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // ============================================
  // FETCH BANNER DATA
  // ============================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHomeData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    };
    fetchData();
  }, []);

  const bannerImage =
    "https://beljumlah-11072023-28562543.dev.odoo.com" +
    data?.banner?.banner?.[0]?.image;

  // ============================================
  // LOAD EMAIL FROM MULTIPLE SOURCES
  // ============================================

  useEffect(() => {
    let finalEmail: string | undefined = propEmail;

    // Try sessionStorage if prop not provided
    if (!finalEmail) {
      const storedEmail = sessionStorage.getItem("email");
      finalEmail = storedEmail || undefined;
    }

    // Try URL params if still not found
    if (!finalEmail) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlEmail = urlParams.get("email");
      finalEmail = urlEmail || undefined;
    }

    // Set email if found
    if (finalEmail) {
      setEmail(finalEmail);
      sessionStorage.setItem("emailForOtp", finalEmail);
    }
  }, [propEmail]);

  // ============================================
  // AUTO FOCUS FIRST INPUT
  // ============================================

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // ============================================
  // OTP INPUT HANDLER
  // ============================================

  const handleChange = (value: string, index: number): void => {
    // Only allow numbers
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  // ============================================
  // FORM SUBMIT HANDLER
  // ============================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // Validate email
    if (!email) {
      toast.error("Email not found");
      return;
    }

    // Validate OTP is complete
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const result: VerifyOtpResponse = await verifyOtpData({
        email,
        otp: otpCode,
      });

      // Validate response
      if (result?.status) {
        // ✅ Store all backend data
        sessionStorage.setItem("profileEmail", email);
        sessionStorage.setItem("auth_token", result.auth_token);
        sessionStorage.setItem("userData", JSON.stringify(result));

        toast.success("OTP Verified Successfully!");
        setShowUpdateForm(true);
      } else {
        toast.error("OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // CONDITIONAL RENDER
  // ============================================

  if (showUpdateForm) {
    return <UpdateUserForm />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Card Container */}
      <div className="relative z-10 bg-[#8b6a57] p-4 rounded-2xl shadow-xl">
        {/* White Card */}
        <div className="bg-white w-[380px] rounded-xl p-8 text-center">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
          <div className="border-b border-gray-300 mt-3 mb-5"></div>

          {/* Email Info */}
          <p className="text-lg text-gray-600 mb-1">Enter the code sent to</p>
          <p className="text-lg font-medium text-[#8b6a57] mb-5">{email}</p>
          <p className="text-sm text-gray-500 mb-4">
            We have sent a 6-digit code to your email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit: string, index: number) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputs.current[index] = el;
                  }}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target.value, index)
                  }
                  disabled={isLoading}
                  className="w-12 h-12 text-center text-black text-lg border rounded-md border-black focus:border-[#8b6a57] outline-none disabled:bg-gray-100"
                  placeholder="0"
                  inputMode="numeric"
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => router.push("/register")}
                disabled={isLoading}
                className="px-4 py-2 border rounded-md text-black hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Change Email
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#8b6a57] text-white rounded-md hover:bg-[#755444] disabled:opacity-50 transition flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </form>

          {/* Resend Timer */}
          <p className="text-xs text-[#8b6a57] mt-5">Resend in 0:55</p>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-sm text-white mt-6">
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
