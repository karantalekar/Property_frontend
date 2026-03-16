"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getHomeData } from "@/API/home";
import { loginUserData } from "@/API/loginregister";
import { setToken, loginUser } from "@/redux/slices/authSlice";
import { setProfileData } from "@/redux/slices/profileSlice";
import { getUserProfile } from "@/API/profile";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface LoginResponse {
  status: boolean;
  auth_token: string;
  user_data?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  [key: string]: any;
}

// ============================================
// COMPONENT
// ============================================

export default function LoginOtpForm() {
  // ✅ ALL HOOKS AT TOP LEVEL
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();

  // ✅ REDUX STATE - ACCESS STORED PROFILE DATA
  const reduxProfile = useSelector((state: RootState) => state.profile);
  const reduxAuth = useSelector((state: RootState) => state.auth);

  // ✅ State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [bannerImage, setBannerImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(55);
  const [canResend, setCanResend] = useState<boolean>(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const email = params.get("email");

  // ============================================
  // FETCH BANNER DATA
  // ============================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        const imagePath = data?.banner?.banner?.[0]?.image;
        if (imagePath) {
          const banner = `https://beljumlah-11072023-28562543.dev.odoo.com${imagePath}`;
          setBannerImage(banner);
        }
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    };

    fetchData();
  }, []);

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
    if (value && index < 5) {
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

    // Validate email
    if (!email) {
      toast.error("Email is required");
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
      console.log("🔐 Logging in with email:", email);

      const result: LoginResponse = await loginUserData({
        email: email,
        otp: otpCode,
      });

      console.log("✅ Login Response:", result);

      // Validate auth token
      if (!result?.status || !result?.auth_token) {
        toast.error("Login failed: Invalid response from server");
        return;
      }

      const authToken: string = result.auth_token;

      // ✅ STORE TOKEN IN REDUX IMMEDIATELY
      dispatch(setToken(authToken));
      console.log("✅ Token dispatched to Redux");

      // ✅ STORE USER DATA IN REDUX
      dispatch(
        loginUser({
          user: { email: email },
          auth_token: authToken,
        }),
      );
      console.log("✅ User data stored in Redux");

      // ============================================
      // 🎯 CHECK REDUX PROFILE FIRST
      // If user data is already in Redux (from registration),
      // use that. Otherwise use API response.
      // ============================================

      let profileName = result.user_data?.name || "";
      let profilePhone = result.user_data?.phone || "";
      let profileEmail = result.user_data?.email || email;

      // 🔍 Check if we have stored profile from registration
      if (reduxProfile.user?.name || reduxProfile.user?.phone) {
        console.log("✅ Found stored profile in Redux from registration!");
        console.log("   Profile:", reduxProfile.user);

        // Use Redux stored data (from registration)
        profileName = reduxProfile.user?.name || profileName;
        profilePhone = reduxProfile.user?.phone || profilePhone;
        profileEmail = reduxProfile.user?.email || profileEmail || email;
      } else {
        console.log("📥 Using profile from login API response");
      }

      // ✅ UPDATE REDUX WITH FULL USER DATA
      let customerIdFromApi =
        (result as any)?.user_data?.customer_id ||
        (result as any)?.user_data?.id ||
        (result as any)?.user_data?.customerId ||
        undefined;

      // If login response doesn't include customer_id, fetch profile
      if (!customerIdFromApi) {
        try {
          const profileRes: any = await getUserProfile();
          customerIdFromApi =
            profileRes?.data?.customer_id || profileRes?.data?.id || undefined;
          console.log(
            "✅ Fetched profile after login, customer_id:",
            customerIdFromApi,
          );
        } catch (err) {
          console.warn("⚠️ Failed to fetch profile after login:", err);
        }
      }

      const userData: any = {
        email: profileEmail,
        name: profileName,
      };

      if (customerIdFromApi) userData.customer_id = customerIdFromApi;

      dispatch(
        loginUser({
          user: userData,
          auth_token: authToken,
        }),
      );

      console.log("✅ User logged in via Redux:", userData);

      // ✅ ALSO SET PROFILE DATA (THIS IS CRITICAL!)
      dispatch(
        setProfileData({
          name: profileName || "",
          phone: profilePhone || "",
          email: profileEmail || "",
        }),
      );

      console.log("✅ Profile data set in Redux");
      console.log("   Name:", profileName);
      console.log("   Phone:", profilePhone);
      console.log("   Email:", profileEmail);

      toast.success("Login Successful");

      // ✅ Redirect to account page (where user can see their profile)
      console.log("📍 Redirecting to /account...");
      router.push("/");
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error("Login failed. Please try again.");
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
  // FORMAT TIMER
  // ============================================

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ============================================
  // RENDER
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

      {/* Outer Card Container - Responsive */}
      <div className="relative z-10 bg-[#8b6a57] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        {/* White Card - Responsive */}
        <div className="bg-white w-full rounded-xl p-5 sm:p-6 md:p-8 text-center">
          {/* Header - Responsive */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Verify OTP
          </h2>
          <div className="border-b border-gray-300 mt-3 mb-4 sm:mb-5"></div>

          {/* Email Info - Responsive */}
          <p className="text-xs sm:text-sm md:text-sm text-gray-600 mb-1">
            Enter the code sent to
          </p>
          <p className="text-sm sm:text-base md:text-base font-medium text-[#8b6a57] mb-4 sm:mb-5 break-all">
            {email}
          </p>
          <p className="text-xs sm:text-sm md:text-sm text-gray-500 mb-5 sm:mb-6">
            We have sent a 6-digit code to your email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* OTP Input Fields - Responsive */}
            <div className="flex text-black justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
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
                onClick={() => router.push("/login")}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 rounded-md text-xs sm:text-sm md:text-base text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Change Email
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 md:py-3 bg-[#8b6a57] text-white rounded-md text-xs sm:text-sm md:text-base hover:bg-[#755444] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
          New user?{" "}
          <span
            className="font-semibold cursor-pointer hover:text-gray-200 transition"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
