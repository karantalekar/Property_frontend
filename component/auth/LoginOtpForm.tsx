"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getHomeData } from "@/API/home";
import { loginUserData } from "@/API/loginregister";
import { loginUser } from "@/redux/slices/authSlice";
import { setProfileData } from "@/redux/slices/profileSlice";
import toast from "react-hot-toast";

// ============================================
// TYPES
// ============================================

interface LoginResponse {
  status: boolean;
  message?: string;
  auth_token?: string;
  user_id?: number;
  name?: string;
  email?: string;
  phone?: string;
  wishlist_count?: number;
}

// ============================================
// COMPONENT
// ============================================

export default function LoginOtpForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();

  const email = params.get("email");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [bannerImage, setBannerImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(55);
  const [canResend, setCanResend] = useState(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // ============================================
  // FETCH BANNER
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
        console.error("Banner fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // ============================================
  // AUTO FOCUS
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
  // OTP CHANGE
  // ============================================

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6 - index);

    if (!digits.length) return;

    const newOtp = [...otp];

    for (let i = 0; i < digits.length; i++) {
      newOtp[index + i] = digits[i];
    }

    setOtp(newOtp);

    const nextIndex = Math.min(index + digits.length, 5);
    inputs.current[nextIndex]?.focus();
  };

  // ============================================
  // LOGIN SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email missing");
      return;
    }

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);

    try {
      const result: LoginResponse = await loginUserData({
        email,
        otp: otpCode,
      });

      console.log("Login response:", result);

      if (!result?.status || !result?.auth_token) {
        toast.error("Login failed");
        return;
      }

      // ============================================
      // SAVE LOGIN DATA
      // ============================================

      const userData = {
        user_id: result.user_id,
        name: result.name || "",
        email: result.email || email,
        phone: result.phone || "",
        wishlist_count: result.wishlist_count ?? 0,
      };

      dispatch(
        loginUser({
          user: userData,
          auth_token: result.auth_token,
        }),
      );

      // Optional profile slice
      dispatch(
        setProfileData({
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
        }),
      );

      toast.success("Login successful");

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RESEND OTP
  // ============================================

  const handleResendOtp = () => {
    if (!canResend) return;

    setResendTimer(55);
    setCanResend(false);
    setOtp(Array(6).fill(""));

    inputs.current[0]?.focus();

    toast.success("OTP resent");
  };

  // ============================================
  // TIMER FORMAT
  // ============================================

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 bg-[#8b6a57] p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="bg-white rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Verify OTP</h2>

          <p className="text-sm text-gray-500 mt-2">Enter the code sent to</p>

          <p className="font-medium text-[#8b6a57] mb-4 break-all">{email}</p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-md text-center text-black text-lg font-semibold focus:border-[#8b6a57]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8b6a57] text-white py-3 rounded-md hover:bg-[#755444]"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="mt-4 text-sm text-gray-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#8b6a57] font-semibold"
                >
                  Resend OTP
                </button>
              ) : (
                <>Resend in {formatTimer(resendTimer)}</>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
