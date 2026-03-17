"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { getHomeData } from "@/API/home";
import { updateUserProfile, getUserProfile } from "@/API/profile";
import { setProfileData, setLoading } from "@/redux/slices/profileSlice";
import { logoutUser } from "@/redux/slices/authSlice";
import { removeFromWishlist } from "@/redux/slices/Wishlistslice";
import { updateWishlist } from "@/API/Wishlist";
import Link from "next/link";
import { Heart, Trash2, Star, ArrowRight } from "lucide-react";
import BookedProperties from "@/component/user/BookedProperties";

export default function AccountProfile() {
  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ REDUX STATE
  const authToken = useSelector((state: RootState) => state.auth.auth_token);
  const authEmail = useSelector((state: RootState) => state.auth.user?.email);
  const authName = useSelector((state: RootState) => state.auth.user?.name);

  const customerId = useSelector(
    (state: RootState) => state.auth.user?.user_id,
  );
  const reduxProfile = useSelector((state: RootState) => state.profile);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // ✅ LOCAL STATE
  const [activeTab, setActiveTab] = useState("info");
  const [bannerImage, setBannerImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [removingWishlistId, setRemovingWishlistId] = useState<number | null>(
    null,
  );

  // Form fields - derived from Redux
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Track if profile fetch already attempted to avoid duplicate fetches
  const profileLoadedRef = useRef(false);

  const BASE_URL = "https://beljumlah-11072023-28562543.dev.odoo.com";

  // ============================================
  // AUTH CHECK - REDIRECT IF NOT LOGGED IN
  // ============================================
  useEffect(() => {
    if (!authToken) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [authToken, router]);

  // ============================================
  // FETCH BANNER
  // ============================================
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getHomeData();
        const imagePath = data?.banner?.banner?.[0]?.image;
        if (imagePath) {
          setBannerImage(`${BASE_URL}${imagePath}`);
        }
      } catch (error) {
        console.log("Banner fetch failed:", error);
      }
    };
    fetchBanner();
  }, []);

  // ============================================
  // SYNC local form state FROM Redux WHEN available
  // (DO NOT overwrite while user is editing)
  // ============================================
  useEffect(() => {
    if (!isEditing && reduxProfile.user) {
      setName(reduxProfile.user.name ?? "");
      setPhone(reduxProfile.user.phone ?? "");
      setEmail(reduxProfile.user.email ?? authEmail ?? "");
    }
    // note: we intentionally do not set profileLoadedRef here (it's for fetch flow)
  }, [reduxProfile.user, isEditing, authEmail]);

  // ============================================
  // LOAD PROFILE DATA ON MOUNT - only if Redux doesn't have it
  // and ensure loading flag is always cleared
  // ============================================
  useEffect(() => {
    const loadProfile = async () => {
      if (!authToken) return;

      // If redux already has user info, avoid calling the API.
      // Also mark profileLoadedRef so we don't attempt to refetch unnecessarily.
      if (
        reduxProfile.user?.name ||
        reduxProfile.user?.phone ||
        reduxProfile.user?.email
      ) {
        profileLoadedRef.current = true;
        // ensure loading flag is cleared
        dispatch(setLoading(false));
        return;
      }

      // Don't try to fetch more than once per mount unless explicitly desired
      if (profileLoadedRef.current) {
        return;
      }

      profileLoadedRef.current = true; // mark so we won't double-fetch in fast re-renders
      dispatch(setLoading(true));

      try {
        const data = await getUserProfile();

        if (data?.status) {
          const profileName =
            data.name ||
            data.full_name ||
            data.first_name ||
            data.user_name ||
            data.display_name ||
            authName ||
            "";

          const profilePhone =
            data.phone ||
            data.phone_number ||
            data.mobile ||
            data.contact ||
            data.contact_number ||
            "";

          const profileEmail = data.email || data.user_email || authEmail || "";

          // update local form state (but only if user is not actively editing)
          if (!isEditing) {
            setName(profileName);
            setPhone(profilePhone);
            setEmail(profileEmail);
          }

          // persist to Redux so other pages/components can use it
          dispatch(
            setProfileData({
              name: profileName,
              phone: profilePhone,
              email: profileEmail,
            }),
          );
        } else {
          // API returned an unsuccessful status — you can log or show a toast
          console.warn("User profile fetch returned no status or false.");
        }
      } catch (error) {
        console.error("❌ Profile fetch failed:", error);
      } finally {
        // ALWAYS clear loading flag so spinner doesn't get stuck
        dispatch(setLoading(false));
      }
    };

    loadProfile();
    // include reduxProfile.user so if Redux becomes populated quickly we avoid the API branch
  }, [authToken, reduxProfile.user, dispatch, authName, authEmail, isEditing]);

  // ============================================
  // HANDLE EDIT/SAVE TOGGLE
  // ============================================
  const handleEditToggle = async () => {
    if (isEditing) {
      // SAVE MODE
      if (!name.trim() || !phone.trim()) {
        toast.error("Name and phone are required");
        return;
      }

      dispatch(setLoading(true));

      try {
        console.log("📤 Saving profile:", { name, phone, email });

        const result = await updateUserProfile({
          name: name.trim(),
          phone: phone.trim(),
        });

        if (result?.status) {
          dispatch(
            setProfileData({
              name: name.trim(),
              phone: phone.trim(),
              email: email || authEmail || "",
            }),
          );

          console.log("✅ Profile updated in Redux");
          toast.success("Profile updated successfully!");
          setIsEditing(false);
        } else {
          toast.error(result?.message || "Update failed");
        }
      } catch (error: any) {
        console.error("❌ Update error:", error);
        toast.error(
          error?.message || "Failed to update profile. Please try again.",
        );
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      // EDIT MODE
      setIsEditing(true);
    }
  };

  // ============================================
  // HANDLE REMOVE FROM WISHLIST
  // ============================================
  const handleRemoveFromWishlist = async (productId: number) => {
    const effectiveCustomerId = customerId ?? 10;

    setRemovingWishlistId(productId);

    try {
      const response = await updateWishlist({
        customer_id: effectiveCustomerId,
        product_id: productId,
        in_wishlist: false,
      });

      if (response?.status) {
        dispatch(removeFromWishlist(productId));
        toast.success("Removed from wishlist!");
      } else {
        toast.error(response?.message || "Failed to remove from wishlist");
      }
    } catch (error: any) {
      console.error("Remove wishlist error:", error);
      toast.error(error?.message || "Failed to remove from wishlist");
    } finally {
      setRemovingWishlistId(null);
    }
  };

  // ============================================
  // HANDLE LOGOUT
  // ============================================
  const handleLogout = () => {
    console.log("🔓 Logging out from Redux...");
    dispatch(logoutUser());
    console.log("✅ Logout complete - Redux state cleared");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // ============================================
  // RENDER (unchanged—only small tweak to email input)
  // ============================================
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-3 sm:px-6 py-24 sm:py-20 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
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
      <div className="w-full max-w-7xl bg-[#9c755b] p-3 sm:p-4 rounded-2xl shadow-xl relative z-10">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold">
              Account
            </h2>
            <div className="flex gap-2">
              <button
                className="bg-[#9c755b] text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base hover:bg-[#8b6a57] transition-colors"
                onClick={() => router.push("/")}
              >
                Back
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 md:gap-6 overflow-x-auto border-b pb-2 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base bg-[#FFFBF1] px-2 sm:px-3 py-3 sm:py-4 rounded-t-lg">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-2 whitespace-nowrap transition-all font-medium ${
                activeTab === "info"
                  ? "border-b-2 border-[#9c755b] text-[#9c755b]"
                  : "text-black hover:text-[#9c755b]"
              }`}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveTab("booking")}
              className={`pb-2 whitespace-nowrap transition-all font-medium ${
                activeTab === "booking"
                  ? "border-b-2 border-[#9c755b] text-[#9c755b]"
                  : "text-black hover:text-[#9c755b]"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`pb-2 whitespace-nowrap transition-all font-medium ${
                activeTab === "wishlist"
                  ? "border-b-2 border-[#9c755b] text-[#9c755b]"
                  : "text-black hover:text-[#9c755b]"
              }`}
            >
              Wishlist ({wishlistItems.length})
            </button>
          </div>

          {/* Account Info Tab */}
          {activeTab === "info" && (
            <div className="border rounded-xl p-3 sm:p-4 md:p-6 relative">
              <button
                onClick={handleEditToggle}
                disabled={reduxProfile.loading}
                className="absolute right-3 sm:right-4 md:right-6 top-3 sm:top-4 md:top-6 bg-[#9c755b] text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 rounded-md text-xs sm:text-sm hover:bg-[#8b5f47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing
                  ? reduxProfile.loading
                    ? "Saving..."
                    : "Save"
                  : "Edit"}
              </button>

              <h3 className="font-semibold text-black mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg md:text-xl pr-20">
                Account Information
              </h3>

              {reduxProfile.loading ? (
                <div className="flex justify-center py-6 sm:py-8 md:py-10">
                  <div className="inline-block w-8 h-8 border-4 border-[#9c755b] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {/* NAME - EDITABLE */}
                  <div>
                    <label className="text-xs sm:text-xs md:text-sm text-black font-medium block mb-1.5 sm:mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing || reduxProfile.loading}
                      className={`w-full border border-[#9c755b] text-black rounded-md px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base transition-all ${
                        isEditing && !reduxProfile.loading
                          ? "bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#9c755b] focus:border-transparent"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* PHONE - EDITABLE */}
                  <div>
                    <label className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium block mb-1.5 sm:mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing || reduxProfile.loading}
                      className={`w-full border border-[#9c755b] text-black rounded-md px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base transition-all ${
                        isEditing && !reduxProfile.loading
                          ? "bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#9c755b] focus:border-transparent"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* EMAIL - READ ONLY */}
                  <div className="md:col-span-2">
                    <label className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium block mb-1.5 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email || ""}
                      readOnly
                      placeholder="No email set"
                      className="w-full border border-[#9c755b] rounded-md px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 text-black bg-gray-100 cursor-not-allowed text-sm sm:text-base shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking Tab */}
          {activeTab === "booking" && <BookedProperties />}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="border rounded-xl p-3 sm:p-4 md:p-6">
              {wishlistItems.length === 0 ? (
                <div className="text-gray-500 text-sm sm:text-base text-center py-12 sm:py-16 md:py-20">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Your wishlist is empty</p>
                  <Link href="/properties/">
                    <button className="mt-4 bg-[#9c755b] text-white px-4 py-2 rounded-lg hover:bg-[#8b6a57] transition-colors text-sm sm:text-base">
                      Browse Properties
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-black mb-4 sm:mb-6 text-base sm:text-lg md:text-xl">
                    My Wishlist ({wishlistItems.length} items)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                          <img
                            src={`${BASE_URL}${item.image_1920}`}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {item.discount_value && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-[#FFD700] text-black text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-lg shadow-md">
                                {item.discount_value}% Off
                              </span>
                            </div>
                          )}

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            disabled={removingWishlistId === item.id}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-md transition-all disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-4">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <Star
                              size={14}
                              className="fill-[#FFD700] text-[#FFD700]"
                            />
                            <span className="text-xs sm:text-sm font-bold text-gray-800">
                              {item.rating}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({item.review_count})
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                            {item.name}
                          </h4>

                          {/* Location */}
                          <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-1">
                            {item.city_name}
                          </p>

                          {/* Price & Action */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase">
                                From
                              </p>
                              <span className="text-base sm:text-lg font-black text-gray-900">
                                {item.list_price}
                              </span>
                              <span className="text-[8px] sm:text-xs text-gray-500 ml-1">
                                SAR
                              </span>
                            </div>
                            <Link href={`/properties/${item.slug}`}>
                              <button className="bg-[#9c755b] p-2 sm:p-2.5 rounded-lg text-white hover:bg-[#8b6a57] transition-all">
                                <ArrowRight size={16} />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
