"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { RootState, AppDispatch } from "@/redux/store"; // Adjust path
import { getHomeData } from "@/API/home";
import { updateUserProfile, getUserProfile } from "@/API/profile";
import { useAppDispatch } from "@/hooks/hook";

export default function AccountProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // ✅ REDUX SELECTORS
  const {
    user: authUser,
    token: authToken,
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState("info");
  const [bannerImage, setBannerImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localFormData, setLocalFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // ✅ PRIORITY DATA SOURCE: Redux Auth → localStorage → empty
  // ✅ ADD THIS - Line ~25 (after auth selectors)
  const profile = useSelector((state: RootState) => state.profile);

  // ✅ REPLACE your formData (lines ~35-42) with this:
  const formData = {
    name: localFormData.name || profile.user?.name || authUser?.name || "",
    phone: localFormData.phone || profile.user?.phone || "",
    email:
      localFormData.email ||
      profile.user?.email ||
      authUser?.email ||
      localStorage.getItem("user_email") ||
      "",
  };

  // 🔐 Auth check & redirect
  useEffect(() => {
    if (!authToken && !localStorage.getItem("auth_token")) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [authToken, router]);

  // Banner fetch
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getHomeData();
        const imagePath = data?.banner?.banner?.[0]?.image;
        if (imagePath) {
          setBannerImage(
            `https://beljumlah-11072023-28562543.dev.odoo.com${imagePath}`,
          );
        }
      } catch (error) {
        console.log("Banner fetch failed:", error);
      }
    };
    fetchBanner();
  }, []);

  // ✅ FIXED fetchProfile - Try ALL possible backend field names
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken && !localStorage.getItem("auth_token")) return;

      try {
        setLoading(true);
        const data = await getUserProfile();

        console.log("🔍 API RESPONSE:", data); // ← Check this!

        if (data?.status) {
          setLocalFormData({
            // ✅ TRY THESE field combinations:
            name:
              data.name ||
              data.full_name ||
              data.first_name ||
              data.user_name ||
              data.display_name ||
              "",
            phone:
              data.phone ||
              data.phone_number ||
              data.mobile ||
              data.contact ||
              data.contact_number ||
              "",
            email: data.email || data.user_email || "",
          });

          // Update localStorage
          if (data.email || data.user_email) {
            localStorage.setItem("user_email", data.email || data.user_email);
          }
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  // Form change handler (name & phone only)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name" || name === "phone") {
      setLocalFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Edit/Save toggle
  const handleEditToggle = async () => {
    if (isEditing) {
      // SAVE
      try {
        setLoading(true);
        const result = await updateUserProfile({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });

        if (result?.status) {
          toast.success("Profile updated successfully!");
          setIsEditing(false);
          setLocalFormData({
            ...localFormData,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
          });
        } else {
          toast.error(result?.message || "Update failed");
        }
      } catch (err: any) {
        console.error("Profile update error:", err);
        toast.error("Failed to update profile");
      } finally {
        setLoading(false);
      }
    } else {
      // EDIT MODE
      setIsEditing(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-6 py-10">
      {/* Background */}
      <div className="absolute inset-0">
        {bannerImage ? (
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
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b6a57] to-[#9c755b]"></div>
        )}
      </div>

      {/* Card */}
      <div className="w-full max-w-5xl bg-[#9c755b] p-3 sm:p-4 rounded-2xl shadow-xl relative z-10">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-4xl text-black font-bold">
              Account
            </h2>
            <button
              className="bg-[#9c755b] text-white px-8 sm:px-5 py-3 rounded-lg text-xl md:w-[15%] w-auto hover:bg-[#8b6a57] transition-colors"
              onClick={() => router.push("/")}
            >
              Back
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 overflow-x-auto border-b pb-2 mb-6 text-sm sm:text-base bg-[#FFFBF1] md:h-20">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-2 whitespace-nowrap transition-all ${
                activeTab === "info"
                  ? "border-b-2 border-[#9c755b] ml-5 font-medium text-lg text-[#9c755b]"
                  : "text-black hover:text-[#9c755b]"
              }`}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveTab("booking")}
              className={`pb-2 whitespace-nowrap transition-all ${
                activeTab === "booking"
                  ? "border-b-2 border-[#9c755b] font-medium text-lg text-[#9c755b]"
                  : "text-black hover:text-[#9c755b]"
              }`}
            >
              Booking
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`pb-2 whitespace-nowrap transition-all ${
                activeTab === "wishlist"
                  ? "border-b-2 border-[#9c755b] font-medium text-lg text-[#9c755b]"
                  : "text-black hover:text-[#9c755b]"
              }`}
            >
              Wishlist
            </button>
          </div>

          {/* Account Info Form */}
          {activeTab === "info" && (
            <div className="border rounded-xl p-4 sm:p-6 relative">
              <button
                onClick={handleEditToggle}
                disabled={loading}
                className="absolute right-4 top-4 bg-[#9c755b] text-white px-5 py-2 rounded-md text-xs sm:text-sm hover:bg-[#8b5f47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? (loading ? "Saving..." : "Save") : "Edit"}
              </button>

              <h3 className="font-semibold text-black mb-6 text-lg sm:text-xl">
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* NAME - Editable */}
                <div>
                  <label className="text-xs sm:text-sm text-black font-medium block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing || loading}
                    className={`w-full mt-1 border border-[#9c755b] text-black rounded-md px-3 py-2 text-lg transition-all ${
                      isEditing && !loading
                        ? "bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#9c755b] focus:border-transparent"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* PHONE - Editable */}
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 font-medium block mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing || loading}
                    className={`w-full mt-1 border border-[#9c755b] text-black rounded-md px-3 py-2 text-lg transition-all ${
                      isEditing && !loading
                        ? "bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#9c755b] focus:border-transparent"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* EMAIL - Read Only */}
                <div className="md:col-span-2">
                  <label className="text-xs sm:text-sm text-gray-600 font-medium block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || "No email set"}
                    readOnly
                    className="w-full mt-1 border border-[#9c755b] rounded-md px-3 py-2 text-black bg-gray-100 cursor-not-allowed text-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab === "booking" && (
            <div className="p-4 sm:p-6 text-gray-500 text-sm text-center">
              No bookings yet
            </div>
          )}
          {activeTab === "wishlist" && (
            <div className="p-4 sm:p-6 text-gray-500 text-sm text-center">
              Wishlist is empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
