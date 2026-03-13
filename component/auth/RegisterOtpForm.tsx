// "use client";

// import { useState, useRef, useEffect } from "react";
// import { getHomeData } from "@/API/home";
// import { verifyOtpData } from "@/API/loginregister";
// import UpdateUserForm from "@/component/auth/UpdateUserForm";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { useAppDispatch } from "@/hooks/hook";
// import { loginUser } from "@/redux/slices/authSlice";
// // ============================================
// // TYPE DEFINITIONS
// // ============================================

// interface VerifyOtpResponse {
//   status: boolean;
//   auth_token: string;
//   [key: string]: any;
// }

// interface RegisterOtpFormProps {
//   email?: string;
// }

// // ============================================
// // COMPONENT
// // ============================================

// export default function RegisterOtpForm({
//   email: propEmail,
// }: RegisterOtpFormProps) {
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
//   const [email, setEmail] = useState<string>("");
//   const [data, setData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

//   const inputs = useRef<(HTMLInputElement | null)[]>([]);
//   const router = useRouter();

//   // ============================================
//   // FETCH BANNER DATA
//   // ============================================

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getHomeData();
//         setData(result);
//       } catch (error) {
//         console.error("Failed to fetch banner:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const bannerImage =
//     "https://beljumlah-11072023-28562543.dev.odoo.com" +
//     data?.banner?.banner?.[0]?.image;

//   // ============================================
//   // LOAD EMAIL FROM MULTIPLE SOURCES
//   // ============================================

//   useEffect(() => {
//     let finalEmail: string | undefined = propEmail;

//     // Try sessionStorage if prop not provided
//     if (!finalEmail) {
//       const storedEmail = sessionStorage.getItem("email");
//       finalEmail = storedEmail || undefined;
//     }

//     // Try URL params if still not found
//     if (!finalEmail) {
//       const urlParams = new URLSearchParams(window.location.search);
//       const urlEmail = urlParams.get("email");
//       finalEmail = urlEmail || undefined;
//     }

//     // Set email if found
//     if (finalEmail) {
//       setEmail(finalEmail);
//       sessionStorage.setItem("emailForOtp", finalEmail);
//     }
//   }, [propEmail]);

//   // ============================================
//   // AUTO FOCUS FIRST INPUT
//   // ============================================

//   useEffect(() => {
//     inputs.current[0]?.focus();
//   }, []);

//   // ============================================
//   // OTP INPUT HANDLER
//   // ============================================

//   const handleChange = (value: string, index: number): void => {
//     // Only allow numbers
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < otp.length - 1) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   // ============================================
//   // FORM SUBMIT HANDLER
//   // ============================================

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//   ): Promise<void> => {
//     e.preventDefault();

//     // Validate email
//     if (!email) {
//       toast.error("Email not found");
//       return;
//     }

//     // Validate OTP is complete
//     const otpCode = otp.join("");
//     if (otpCode.length !== 6) {
//       toast.error("Please enter all 6 digits");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const result: VerifyOtpResponse = await verifyOtpData({
//         email,
//         otp: otpCode,
//       });

//       // Validate response
//       if (result?.status) {
//         // ✅ Store all backend data
//         sessionStorage.setItem("profileEmail", email);
//         sessionStorage.setItem("auth_token", result.auth_token);
//         sessionStorage.setItem("userData", JSON.stringify(result));

//         toast.success("OTP Verified Successfully!");
//         setShowUpdateForm(true);
//       } else {
//         toast.error("OTP verification failed");
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast.error("Invalid OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ============================================
//   // CONDITIONAL RENDER
//   // ============================================

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

//       {/* Card Container */}
//       <div className="relative z-10 bg-[#8b6a57] p-4 rounded-2xl shadow-xl">
//         {/* White Card */}
//         <div className="bg-white w-[380px] rounded-xl p-8 text-center">
//           {/* Header */}
//           <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
//           <div className="border-b border-gray-300 mt-3 mb-5"></div>

//           {/* Email Info */}
//           <p className="text-lg text-gray-600 mb-1">Enter the code sent to</p>
//           <p className="text-lg font-medium text-[#8b6a57] mb-5">{email}</p>
//           <p className="text-sm text-gray-500 mb-4">
//             We have sent a 6-digit code to your email.
//           </p>

//           {/* Form */}
//           <form onSubmit={handleSubmit}>
//             {/* OTP Input Fields */}
//             <div className="flex justify-center gap-3 mb-6">
//               {otp.map((digit: string, index: number) => (
//                 <input
//                   key={index}
//                   ref={(el: HTMLInputElement | null) => {
//                     inputs.current[index] = el;
//                   }}
//                   type="text"
//                   value={digit}
//                   maxLength={1}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     handleChange(e.target.value, index)
//                   }
//                   disabled={isLoading}
//                   className="w-12 h-12 text-center text-black text-lg border rounded-md border-black focus:border-[#8b6a57] outline-none disabled:bg-gray-100"
//                   placeholder="0"
//                   inputMode="numeric"
//                 />
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 justify-center">
//               <button
//                 type="button"
//                 onClick={() => router.push("/register")}
//                 disabled={isLoading}
//                 className="px-4 py-2 border rounded-md text-black hover:bg-gray-100 disabled:opacity-50 transition"
//               >
//                 Change Email
//               </button>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="px-6 py-2 bg-[#8b6a57] text-white rounded-md hover:bg-[#755444] disabled:opacity-50 transition flex items-center gap-2"
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                     Verifying...
//                   </>
//                 ) : (
//                   "Verify"
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Resend Timer */}
//           <p className="text-xs text-[#8b6a57] mt-5">Resend in 0:55</p>
//         </div>

//         {/* Bottom Link */}
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

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getHomeData } from "@/API/home";
import { verifyOtpData } from "@/API/loginregister";
import UpdateUserForm from "@/component/auth/UpdateUserForm";
import { setToken, setUser } from "@/redux/slices/authSlice"; // ✅ Updated import
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface VerifyOtpResponse {
  status: boolean;
  auth_token: string;
  [key: string]: any;
}

interface RegisterOtpFormProps {
  email?: string;
}

export default function RegisterOtpForm({
  email: propEmail,
}: RegisterOtpFormProps) {
  // ✅ ALL HOOKS AT TOP LEVEL
  const dispatch = useDispatch(); // ✅ Get dispatch
  const router = useRouter();

  // ✅ State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ Fetch banner data
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

  const bannerImage = data?.banner?.banner?.[0]?.image
    ? `https://beljumlah-11072023-28562543.dev.odoo.com${data.banner.banner[0].image}`
    : "";

  // ✅ Load email from multiple sources
  useEffect(() => {
    let finalEmail: string | undefined = propEmail;

    if (!finalEmail) {
      const storedEmail = sessionStorage.getItem("email");
      finalEmail = storedEmail || undefined;
    }

    if (!finalEmail) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlEmail = urlParams.get("email");
      finalEmail = urlEmail || undefined;
    }

    if (finalEmail) {
      setEmail(finalEmail);
      sessionStorage.setItem("emailForOtp", finalEmail);
    }
  }, [propEmail]);

  // ✅ Auto focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // ✅ OTP input handler
  const handleChange = (value: string, index: number): void => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  // ✅ Form submit handler - uses closure to access dispatch
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found");
      return;
    }

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

      if (result?.status && result?.auth_token) {
        // ✅ STORE TOKEN IN REDUX IMMEDIATELY
        dispatch(setToken(result.auth_token));
        console.log("✅ Token dispatched to Redux");

        // ✅ Also store in sessionStorage as backup
        sessionStorage.setItem("profileEmail", email);
        sessionStorage.setItem("auth_token", result.auth_token);
        sessionStorage.setItem("userData", JSON.stringify(result));

        // ✅ Optional: Set user in Redux if data available
        if (result.user_data?.name || result.email) {
          dispatch(
            setUser({
              email: email,
              name: result.user_data?.name,
            }),
          );
        }

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

  // ✅ Show profile form after successful OTP verification
  // if (showUpdateForm) {
  //   return <UpdateUserForm email={email} />;
  // }

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
