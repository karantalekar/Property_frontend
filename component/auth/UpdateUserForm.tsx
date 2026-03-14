// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { getHomeData } from "@/API/home";
// import { addUserProfileData } from "@/API/profile";
// import { setProfileData, setLoading } from "@/redux/slices/profileSlice";
// import { clearTempEmail, clearTemporaryToken } from "@/redux/slices/authSlice";
// import toast from "react-hot-toast";
// import { RootState } from "@/redux/store";

// interface CompleteProfileFormProps {
//   email?: string;
// }

// export default function CompleteProfileForm({
//   email: propEmail,
// }: CompleteProfileFormProps) {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   // ✅ REDUX STATE
//   const profile = useSelector((state: RootState) => state.profile);
//   const auth = useSelector((state: RootState) => state.auth);

//   const [data, setData] = useState<any>(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     phone: "",
//   });

//   // ============================================
//   // FETCH BANNER
//   // ============================================

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getHomeData();
//         setData(result);
//       } catch (error) {
//         console.log("Banner fetch failed:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const bannerImage = data?.banner?.banner?.[0]?.image
//     ? `https://beljumlah-11072023-28562543.dev.odoo.com${data.banner.banner[0].image}`
//     : "";

//   // ============================================
//   // LOAD EMAIL FROM REDUX (PRIMARY) OR PROPS
//   // ============================================

//   useEffect(() => {
//     let finalEmail = propEmail;

//     // Try props first
//     if (!finalEmail && propEmail) {
//       finalEmail = propEmail;
//     }

//     // Try Redux temp email
//     if (!finalEmail && auth.tempEmail) {
//       finalEmail = auth.tempEmail;
//     }

//     // Try Redux auth user email
//     if (!finalEmail && auth.user?.email) {
//       finalEmail = auth.user.email;
//     }

//     if (finalEmail) {
//       setFormData((prev) => ({
//         ...prev,
//         email: finalEmail || "",
//       }));
//     }
//   }, [propEmail, auth.tempEmail, auth.user?.email]);

//   // ============================================
//   // FORM CHANGE HANDLER
//   // ============================================

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ============================================
//   // FORM SUBMIT HANDLER
//   // ============================================

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const name = formData.name.trim();
//     const phone = formData.phone.trim();
//     const email = formData.email.trim();

//     // Validation
//     if (!name || !phone || !email) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     // ✅ SET LOADING IN REDUX
//     dispatch(setLoading(true));

//     try {
//       console.log("📤 Creating profile:", { name, phone, email });

//       const result = await addUserProfileData({
//         name,
//         phone,
//         email,
//       });

//       console.log("✅ Profile Creation Response:", result);

//       if (result?.status) {
//         // ✅ STORE PROFILE DATA IN REDUX PROFILE SLICE ONLY
//         dispatch(
//           setProfileData({
//             name,
//             phone,
//             email,
//           }),
//         );

//         console.log("✅ Profile created and stored in Redux:");
//         console.log("   - Name:", name);
//         console.log("   - Phone:", phone);
//         console.log("   - Email:", email);

//         toast.success("Profile completed successfully!");

//         // ✅ CLEAR TEMPORARY EMAIL FROM REDUX
//         dispatch(clearTempEmail());

//         // ✅ CLEAR TEMPORARY TOKEN FROM REDUX
//         // After profile creation, user must log in again via login flow
//         dispatch(clearTemporaryToken());
//         console.log("✅ Temporary token cleared - user must log in now");

//         // ✅ REDIRECT TO LOGIN PAGE (user needs to log in now)
//         console.log("📍 Redirecting to login page...");
//         setTimeout(() => {
//           router.push("/login");
//         }, 1500);
//       } else {
//         toast.error(result?.message || "Failed to save profile");
//       }
//     } catch (error: any) {
//       console.error("❌ Profile creation error:", error);
//       toast.error(
//         error?.message || "Failed to save profile. Please try again.",
//       );
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // ============================================
//   // RENDER
//   // ============================================

//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-4">
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         {bannerImage ? (
//           <>
//             <img
//               src={bannerImage}
//               alt="Background"
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).style.display = "none";
//               }}
//             />
//             <div className="absolute inset-0 bg-black/60"></div>
//           </>
//         ) : (
//           <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
//         )}
//       </div>

//       {/* Form Card */}
//       <div className="relative z-10 bg-[#9c755b] p-4 rounded-2xl shadow-xl w-full max-w-md">
//         <div className="bg-white rounded-xl p-8">
//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
//             Complete Profile
//           </h2>

//           <div className="border-b border-gray-300 my-3"></div>

//           <p className="text-center text-gray-500 text-sm mb-6">
//             Tell us a bit more about you
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email - Pre-filled, NON-EDITABLE */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 readOnly
//                 className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-900 cursor-not-allowed focus:ring-0 focus:border-gray-300"
//                 placeholder="Email loaded automatically"
//               />
//             </div>

//             {/* Full Name - EDITABLE */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="John Doe"
//                 value={formData.name}
//                 onChange={handleChange}
//                 disabled={profile.loading}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-[#9c755b] focus:border-[#9c755b] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition"
//                 required
//               />
//             </div>

//             {/* Phone - EDITABLE */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone Number *
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="9876543210"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 disabled={profile.loading}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-[#9c755b] focus:border-[#9c755b] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition"
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={
//                 !formData.name.trim() ||
//                 !formData.phone.trim() ||
//                 !formData.email.trim() ||
//                 profile.loading
//               }
//               className="w-full bg-[#9c755b] text-white py-3 rounded-md font-medium hover:bg-[#8b6a57] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//             >
//               {profile.loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Saving...
//                 </span>
//               ) : (
//                 "Complete Registration"
//               )}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-500 mt-6">
//             Already have an account?{" "}
//             <span
//               className="text-[#9c755b] cursor-pointer font-medium hover:underline"
//               onClick={() => router.push("/login")}
//             >
//               Login
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getHomeData } from "@/API/home";
import { addUserProfileData } from "@/API/profile";
import { setProfileData, setLoading } from "@/redux/slices/profileSlice";
import { clearTempEmail, clearTemporaryToken } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";

interface CompleteProfileFormProps {
  email?: string;
}

export default function CompleteProfileForm({
  email: propEmail,
}: CompleteProfileFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ REDUX STATE
  const profile = useSelector((state: RootState) => state.profile);
  const auth = useSelector((state: RootState) => state.auth);

  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  // ============================================
  // FETCH BANNER
  // ============================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHomeData();
        setData(result);
      } catch (error) {
        console.log("Banner fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  const bannerImage = data?.banner?.banner?.[0]?.image
    ? `https://beljumlah-11072023-28562543.dev.odoo.com${data.banner.banner[0].image}`
    : "";

  // ============================================
  // LOAD EMAIL FROM REDUX (PRIMARY) OR PROPS
  // ============================================

  useEffect(() => {
    let finalEmail = propEmail;

    // Try props first
    if (!finalEmail && propEmail) {
      finalEmail = propEmail;
    }

    // Try Redux temp email
    if (!finalEmail && auth.tempEmail) {
      finalEmail = auth.tempEmail;
    }

    // Try Redux auth user email
    if (!finalEmail && auth.user?.email) {
      finalEmail = auth.user.email;
    }

    if (finalEmail) {
      setFormData((prev) => ({
        ...prev,
        email: finalEmail || "",
      }));
    }
  }, [propEmail, auth.tempEmail, auth.user?.email]);

  // ============================================
  // FORM CHANGE HANDLER
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // FORM SUBMIT HANDLER
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    // Validation
    if (!name || !phone || !email) {
      toast.error("Please fill all fields");
      return;
    }

    // ✅ SET LOADING IN REDUX
    dispatch(setLoading(true));

    try {
      console.log("📤 Creating profile:", { name, phone, email });

      const result = await addUserProfileData({
        name,
        phone,
        email,
      });

      console.log("✅ Profile Creation Response:", result);

      if (result?.status) {
        // ✅ STORE PROFILE DATA IN REDUX PROFILE SLICE ONLY
        dispatch(
          setProfileData({
            name,
            phone,
            email,
          }),
        );

        console.log("✅ Profile created and stored in Redux:");
        console.log("   - Name:", name);
        console.log("   - Phone:", phone);
        console.log("   - Email:", email);

        toast.success("Profile completed successfully!");

        // ✅ CLEAR TEMPORARY EMAIL FROM REDUX
        dispatch(clearTempEmail());

        // ✅ CLEAR TEMPORARY TOKEN FROM REDUX
        // After profile creation, user must log in again via login flow
        dispatch(clearTemporaryToken());
        console.log("✅ Temporary token cleared - user must log in now");

        // ✅ REDIRECT TO LOGIN PAGE (user needs to log in now)
        console.log("📍 Redirecting to login page...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(result?.message || "Failed to save profile");
      }
    } catch (error: any) {
      console.error("❌ Profile creation error:", error);
      toast.error(
        error?.message || "Failed to save profile. Please try again.",
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {bannerImage ? (
          <>
            <img
              src={bannerImage}
              alt="Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        )}
      </div>

      {/* Form Card - Responsive */}
      <div className="relative z-10 bg-[#9c755b] p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="bg-white rounded-xl p-5 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-center text-gray-800 mb-2">
            Complete Profile
          </h2>

          <div className="border-b border-gray-300 my-3 sm:my-4"></div>

          <p className="text-center text-gray-500 text-xs sm:text-sm md:text-sm mb-5 sm:mb-6">
            Tell us a bit more about you
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-5"
          >
            {/* Email - Pre-filled, NON-EDITABLE */}
            <div>
              <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-900 text-sm sm:text-base cursor-not-allowed focus:ring-0 focus:border-gray-300"
                placeholder="Email loaded automatically"
              />
            </div>

            {/* Full Name - EDITABLE */}
            <div>
              <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={profile.loading}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 text-black text-sm sm:text-base focus:ring-2 focus:ring-[#9c755b] focus:border-[#9c755b] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                required
              />
            </div>

            {/* Phone - EDITABLE */}
            <div>
              <label className="block text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                disabled={profile.loading}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-2.5 text-black text-sm sm:text-base focus:ring-2 focus:ring-[#9c755b] focus:border-[#9c755b] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !formData.name.trim() ||
                !formData.phone.trim() ||
                !formData.email.trim() ||
                profile.loading
              }
              className="w-full bg-[#9c755b] text-white py-2.5 sm:py-3 md:py-3 rounded-md font-medium text-sm sm:text-base hover:bg-[#8b6a57] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {profile.loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </span>
              ) : (
                "Complete Registration"
              )}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm md:text-sm text-gray-500 mt-5 sm:mt-6">
            Already have an account?{" "}
            <span
              className="text-[#9c755b] cursor-pointer font-medium hover:underline transition"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
