"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHomeData } from "@/API/home";
import { sendLoginOtpData } from "@/API/loginregister";

export default function LoginForm() {
  const router = useRouter();

  const [bannerImage, setBannerImage] = useState("");
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await sendLoginOtpData({
        email: email,
      });

      console.log("Login OTP Sent:", result);

      router.push(`/login/otp?email=${email}`);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="relative min-h-screen  flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        {bannerImage && (
          <img
            src={bannerImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0"></div>
      </div>

      {/* Outer Brown Card */}
      <div className="relative z-10 bg-[#8b6a57] p-6 rounded-2xl shadow-xl">
        {/* Inner White Card */}
        <div className="bg-white w-[360px] rounded-xl p-8">
          <h2 className="text-center text-xl font-semibold text-gray-800">
            Login
          </h2>

          <div className="border-b border-black mt-3 mb-5"></div>

          <p className="text-center text-lg text-gray-500 mb-6">
            Sign in to your <span className="text-[#8b6a57]">account</span>
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black mt-2 px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-[#8b6a57]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#8b6a57] text-white py-2.5 rounded-md font-medium hover:bg-[#7a5d4c]"
            >
              Send OTP
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white mt-6">
          New user?{" "}
          <span className="text-white font-semibold">
            <a href="/register">Register here</a>
          </span>
        </p>
      </div>
    </div>
  );
}
