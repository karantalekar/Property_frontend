// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter, useSearchParams } from "next/navigation";
// import { getHomeData } from "@/API/home";
// import { verifyOtpData } from "@/API/loginregister";
// import {
//   setTemporaryToken,
//   setUser,
//   setTempEmail,
//   clearTempEmail,
// } from "@/redux/slices/authSlice";
// import { RootState } from "@/redux/store";
// import toast from "react-hot-toast";
// import CompleteProfileForm from "./UpdateUserForm";

// interface VerifyOtpResponse {
//   status: boolean;
//   auth_token: string;
//   user_data?: {
//     name?: string;
//     email?: string;
//   };
//   [key: string]: any;
// }

// interface RegisterOtpFormProps {
//   email?: string;
// }

// export default function RegisterOtpForm({
//   email: propEmail,
// }: RegisterOtpFormProps) {
//   // ✅ ALL HOOKS AT TOP LEVEL
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const params = useSearchParams();

//   // ✅ REDUX STATE
//   const reduxTempEmail = useSelector(
//     (state: RootState) => state.auth.tempEmail,
//   );

//   // ✅ LOCAL STATE
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
//   const [email, setEmail] = useState<string>("");
//   const [data, setData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [showCompleteProfile, setShowCompleteProfile] =
//     useState<boolean>(false);
//   const [verifiedEmail, setVerifiedEmail] = useState<string>("");

//   const inputs = useRef<(HTMLInputElement | null)[]>([]);

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

//   const bannerImage = data?.banner?.banner?.[0]?.image
//     ? `https://beljumlah-11072023-28562543.dev.odoo.com${data.banner.banner[0].image}`
//     : "";

//   // ============================================
//   // LOAD EMAIL FROM MULTIPLE SOURCES
//   // ============================================

//   useEffect(() => {
//     let finalEmail: string | undefined = propEmail;

//     // Try URL parameter first
//     if (!finalEmail) {
//       const urlEmail = params.get("email");
//       finalEmail = urlEmail || undefined;
//     }

//     // Try Redux temp email
//     if (!finalEmail) {
//       finalEmail = reduxTempEmail || undefined;
//     }

//     if (finalEmail) {
//       setEmail(finalEmail);
//       // ✅ STORE IN REDUX FOR NEXT COMPONENT
//       dispatch(setTempEmail(finalEmail));
//     }
//   }, [propEmail, params, reduxTempEmail, dispatch]);

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

//     if (!email) {
//       toast.error("Email not found");
//       return;
//     }

//     const otpCode = otp.join("");
//     if (otpCode.length !== 6) {
//       toast.error("Please enter all 6 digits");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log("🔐 Verifying OTP for:", email);

//       const result: VerifyOtpResponse = await verifyOtpData({
//         email,
//         otp: otpCode,
//       });

//       console.log("✅ OTP Verification Response:", result);

//       if (result?.status && result?.auth_token) {
//         // ✅ STORE TOKEN TEMPORARILY for profile creation
//         // Store the token so addUserProfileData API call can use it
//         // BUT don't set isAuthenticated yet - that happens on login only
//         dispatch(setTemporaryToken(result.auth_token));
//         console.log("✅ Token stored temporarily for profile creation");

//         // ✅ STORE VERIFIED EMAIL in tempEmail
//         dispatch(setTempEmail(email));
//         console.log("✅ Email verified - stored in Redux tempEmail");

//         toast.success("Email Verified Successfully!");

//         // ✅ Show complete profile form
//         setVerifiedEmail(email);
//         setShowCompleteProfile(true);
//       } else {
//         toast.error("OTP verification failed");
//       }
//     } catch (error) {
//       console.error("❌ OTP verification error:", error);
//       toast.error("Invalid OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ============================================
//   // SHOW COMPLETE PROFILE FORM
//   // ============================================

//   if (showCompleteProfile) {
//     return <CompleteProfileForm email={verifiedEmail} />;
//   }

//   // ============================================
//   // RENDER OTP FORM
//   // ============================================

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
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { getHomeData } from "@/API/home";
import { verifyOtpData } from "@/API/loginregister";
import {
  setTemporaryToken,
  setUser,
  setTempEmail,
  clearTempEmail,
} from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import CompleteProfileForm from "./UpdateUserForm";

interface VerifyOtpResponse {
  status: boolean;
  auth_token: string;
  user_data?: {
    name?: string;
    email?: string;
  };
  [key: string]: any;
}

interface RegisterOtpFormProps {
  email?: string;
}

export default function RegisterOtpForm({
  email: propEmail,
}: RegisterOtpFormProps) {
  // ✅ ALL HOOKS AT TOP LEVEL
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  // ✅ REDUX STATE
  const reduxTempEmail = useSelector(
    (state: RootState) => state.auth.tempEmail,
  );

  // ✅ LOCAL STATE
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCompleteProfile, setShowCompleteProfile] =
    useState<boolean>(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(55);
  const [canResend, setCanResend] = useState<boolean>(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

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

  const bannerImage = data?.banner?.banner?.[0]?.image
    ? `https://beljumlah-11072023-28562543.dev.odoo.com${data.banner.banner[0].image}`
    : "";

  // ============================================
  // LOAD EMAIL FROM MULTIPLE SOURCES
  // ============================================

  useEffect(() => {
    let finalEmail: string | undefined = propEmail;

    // Try URL parameter first
    if (!finalEmail) {
      const urlEmail = params.get("email");
      finalEmail = urlEmail || undefined;
    }

    // Try Redux temp email
    if (!finalEmail) {
      finalEmail = reduxTempEmail || undefined;
    }

    if (finalEmail) {
      setEmail(finalEmail);
      // ✅ STORE IN REDUX FOR NEXT COMPONENT
      dispatch(setTempEmail(finalEmail));
    }
  }, [propEmail, params, reduxTempEmail, dispatch]);

  // ============================================
  // AUTO FOCUS FIRST INPUT
  // ============================================

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // ============================================
  // RESEND TIMER
  // ============================================

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setResendTimer(resendTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

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

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 6 - index);

    if (pastedDigits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedDigits.length && i + index < 6; i++) {
        newOtp[i + index] = pastedDigits[i];
      }
      setOtp(newOtp);

      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      inputs.current[nextIndex]?.focus();
    }
  };

  // ============================================
  // FORM SUBMIT HANDLER
  // ============================================

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
      console.log("🔐 Verifying OTP for:", email);

      const result: VerifyOtpResponse = await verifyOtpData({
        email,
        otp: otpCode,
      });

      console.log("✅ OTP Verification Response:", result);

      if (result?.status && result?.auth_token) {
        // ✅ STORE TOKEN TEMPORARILY for profile creation
        // Store the token so addUserProfileData API call can use it
        // BUT don't set isAuthenticated yet - that happens on login only
        dispatch(setTemporaryToken(result.auth_token));
        console.log("✅ Token stored temporarily for profile creation");

        // ✅ STORE VERIFIED EMAIL in tempEmail
        dispatch(setTempEmail(email));
        console.log("✅ Email verified - stored in Redux tempEmail");

        toast.success("Email Verified Successfully!");

        // ✅ Show complete profile form
        setVerifiedEmail(email);
        setShowCompleteProfile(true);
      } else {
        toast.error("OTP verification failed");
      }
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RESEND OTP HANDLER
  // ============================================

  const handleResendOtp = (): void => {
    if (canResend) {
      setResendTimer(55);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
      toast.success("OTP resent to your email");
    }
  };

  // ============================================
  // SHOW COMPLETE PROFILE FORM
  // ============================================

  if (showCompleteProfile) {
    return <CompleteProfileForm email={verifiedEmail} />;
  }

  // ============================================
  // FORMAT TIMER
  // ============================================

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ============================================
  // RENDER OTP FORM
  // ============================================

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Card Container - Responsive */}
      <div className="relative z-10 bg-[#8b6a57] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        {/* White Card - Responsive */}
        <div className="bg-white w-full rounded-xl p-5 sm:p-6 md:p-8 text-center">
          {/* Header - Responsive */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Verify OTP
          </h2>
          <div className="border-b border-gray-300 mt-3 mb-4 sm:mb-5"></div>

          {/* Email Info - Responsive */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-1">
            Enter the code sent to
          </p>
          <p className="text-base sm:text-lg md:text-lg font-medium text-[#8b6a57] mb-4 sm:mb-5 break-all">
            {email}
          </p>
          <p className="text-xs sm:text-sm md:text-sm text-gray-500 mb-4 sm:mb-6">
            We have sent a 6-digit code to your email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* OTP Input Fields - Responsive */}
            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
              {otp.map((digit: string, index: number) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  maxLength={1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(e, index)
                  }
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    handlePaste(e, index)
                  }
                  disabled={isLoading}
                  className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 text-center text-black text-base sm:text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-[#8b6a57] focus:ring-2 focus:ring-[#8b6a57]/20 outline-none disabled:bg-gray-100 transition flex-shrink-0"
                />
              ))}
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => router.push("/register")}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 rounded-lg text-xs sm:text-sm md:text-base text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Change Email
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 md:py-3 bg-[#8b6a57] text-white rounded-lg text-xs sm:text-sm md:text-base hover:bg-[#755444] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>

            {/* Resend OTP Section - Responsive */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-xs sm:text-sm text-[#8b6a57] font-semibold hover:underline transition"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500">
                  Resend in{" "}
                  <span className="text-[#8b6a57] font-semibold">
                    {formatTimer(resendTimer)}
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Link - Responsive */}
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
