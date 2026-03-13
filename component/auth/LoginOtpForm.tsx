"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHomeData } from "@/API/home";
import { loginUserData } from "@/API/loginregister";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/hooks/hook";
import { loginUser } from "@/redux/slices/authSlice";
import { useSearchParams } from "next/navigation";
export default function LoginOtpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [bannerImage, setBannerImage] = useState("");

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const params = useSearchParams();
  console.log(params);

  const email = params.get("email");
  console.log("email", email);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHomeData();

      const banner =
        "https://beljumlah-11072023-28562543.dev.odoo.com" +
        data?.banner?.banner?.[0]?.image;

      setBannerImage(banner);
    };

    fetchData();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const otpCode = otp.join("");

  //     try {
  //       const result = await loginUserData({ email: email, otp: otpCode });

  //       if (!result?.auth_token) {
  //         toast.error("Login failed: Auth token missing");
  //         return;
  //       }

  //       // ✅ Save auth token
  //       // localStorage.setItem("auth_token", result.auth_token);

  //       console.log("=== API RESPONSE ===");

  //       // console.log("auth token",auth_token");
  //       console.log("result:", result);
  //       console.log("email:", email);

  //       toast.success("Login Successful");

  //       const userData = {
  //         // name: name,
  //         email: email, // Real login email
  //       };

  //       dispatch(loginUser(userData,      token: authToken
  // ));
  //       localStorage.setItem("user", JSON.stringify(userData));

  //       console.log("✅ SAVED userData:", userData);
  //       router.push("/");
  //     } catch (error) {
  //       console.error("Login Error:", error);
  //       toast.error("Login failed");
  //     }
  //   };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    try {
      const result = await loginUserData({ email: email, otp: otpCode });

      if (!result?.auth_token) {
        toast.error("Login failed: Auth token missing");
        return;
      }

      // ✅ SAVE TO BOTH REDUX + localStorage (for persistence)
      const authToken = result.auth_token;
      // localStorage.setItem("auth_token", authToken); // Persistence

      const userData = {
        email: email,
      };

      // ✅ DISPATCH WITH TOKEN
      dispatch(
        loginUser({
          user: userData,
          token: authToken, // ✅ PASS TOKEN TO REDUX
        }),
      );

      console.log("✅ SAVED TO REDUX:", { user: userData, token: authToken });
      toast.success("Login Successful");
      router.push("/");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Outer Card */}
      <div className="relative z-10 bg-[#8b6a57] p-6 rounded-2xl shadow-xl">
        <div className="bg-white w-[380px] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Verify OTP</h2>

          <div className="border-b border-gray-300 mt-3 mb-5"></div>

          <p className="text-sm text-gray-600 mb-1">Enter the code sent to</p>

          <p className="text-sm font-medium text-[#8b6a57] mb-5">{email}</p>

          <p className="text-xs text-gray-500 mb-4">
            We have sent a 6-digit code to your email.
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div className="flex text-black justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-12 h-12 text-center text-lg border rounded-md border-gray-300 focus:border-[#8b6a57] outline-none"
                />
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Change Email
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#8b6a57] text-white rounded-md hover:bg-[#755444]"
              >
                Verify
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 mt-5">Resend in 0:55</p>
        </div>

        <p className="text-center text-sm text-white mt-4">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
