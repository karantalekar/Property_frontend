"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHomeData } from "@/API/home";
import { sendRegisterData } from "@/API/loginregister";
import toast from "react-hot-toast";
export default function RegisterForm() {
  const router = useRouter();

  const [bannerImage, setBannerImage] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHomeData();

      const bannerImage =
        "https://beljumlah-11072023-28562543.dev.odoo.com" +
        data?.banner?.banner?.[0]?.image;

      setBannerImage(bannerImage);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await sendRegisterData({ email });
      console.log("Result:", result);

      // ✅ CHECK STATUS FIRST
      if (!result.status) {
        toast.error(result.message);
        setIsLoading(false);
        router.push("/login");
        return;
      }

      //  ONLY NEW USERS: Show success + redirect
      toast.success("OTP sent successfully!");
      sessionStorage.setItem("emailForOtp", email);
      router.push(`/register/otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        {bannerImage && (
          <img
            src={bannerImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Outer Brown Card */}
      <div className="relative z-10 bg-[#8b6a57] p-6 rounded-2xl shadow-xl">
        {/* Inner White Card */}
        <div className="bg-white w-[360px] rounded-xl p-8">
          <h2 className="text-center text-xl font-semibold text-gray-800">
            Sign Up
          </h2>

          <div className="border-b border-black mt-3 mb-5"></div>

          <p className="text-center text-lg text-gray-500 mb-6">
            Welcome to{" "}
            <span className="text-[#8b6a57] font-semibold">Regent Grove.</span>
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
                className="w-full mt-2 text-black px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-[#8b6a57]"
                required
              />
            </div>

            {/* <button
              type="submit"
              className="w-full bg-[#8b6a57] text-white py-2.5 rounded-md font-medium hover:bg-[#7a5d4c]"
            >
              Send OTP
            </button> */}
            <button
              type="submit"
              className="w-full bg-[#8b6a57] text-white py-2.5 rounded-md font-medium hover:bg-[#7a5d4c]"
              disabled={isLoading}
            >
              {" "}
              {/* Add loading state */}
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-white mt-6">
          Already have an account?{" "}
          <a href="/login" className="font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
