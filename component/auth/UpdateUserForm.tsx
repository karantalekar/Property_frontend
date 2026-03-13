"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getHomeData } from "@/API/home";
import { addUserProfileData } from "@/API/profile";
import { setProfileData, setLoading } from "@/redux/slices/profileSlice"; // Adjust path
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
export default function CompleteProfileForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Redux state
  const profile = useSelector((state: RootState) => state.profile);
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  // Fetch banner
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

  // Load email from sessionStorage
  useEffect(() => {
    const profileEmail = sessionStorage.getItem("profileEmail");
    if (profileEmail) {
      setFormData((prev) => ({
        ...prev,
        email: profileEmail,
      }));
    }
  }, []);

  // FIXED - Always gets LATEST state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, // ← Always latest state
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();

    if (!name || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    // ✅ Redux loading
    dispatch(setLoading(true));

    try {
      const result = await addUserProfileData({
        name,
        phone,
        email: formData.email,
      });

      console.log("✅ Profile Update Response:", result);

      if (result?.status) {
        // ✅ STORE IN REDUX (PERSISTED!)
        dispatch(
          setProfileData({
            name,
            phone,
            email: formData.email,
          }),
        );

        toast.success("Profile completed!");
        sessionStorage.clear();
        router.push("/"); // ✅ Go to account, not login
      } else {
        toast.error(result?.message || "Failed to save");
      }
    } catch (error) {
      toast.error("Save failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        {bannerImage ? (
          <>
            <img
              src={bannerImage}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </>
        ) : null}
      </div>

      {/* Form Card */}
      <div className="relative z-10 bg-[#9c755b] p-4 rounded-2xl shadow-xl w-full max-w-md">
        <div className="bg-white rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Complete Profile
          </h2>

          <div className="border-b border-gray-300 my-3"></div>

          <p className="text-center text-gray-500 text-sm mb-6">
            Tell us a bit more about you
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email - Pre-filled, NON-EDITABLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-900 cursor-not-allowed focus:ring-0 focus:border-gray-300"
                placeholder="Email loaded automatically"
              />
            </div>

            {/* Full Name - EDITABLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-[#9c755b] focus:border-[#9c755b] outline-none"
                required
              />
            </div>

            {/* Phone - EDITABLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-[#9c755b] focus:border-[#9c755b] outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !formData.name.trim() ||
                !formData.phone.trim() ||
                profile.loading
              }
              className="w-full bg-[#9c755b] text-white py-3 rounded-md font-medium hover:bg-[#8b6a57] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
                  Saving...
                </span>
              ) : (
                "Complete Registration"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              className="text-[#9c755b] cursor-pointer font-medium hover:underline"
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

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { getHomeData } from "@/API/home";
// import { addUserProfileData } from "@/API/profile";
// import { setProfileData, setLoading } from "@/redux/slices/profileSlice";
// import toast from "react-hot-toast";
// import { RootState } from "@/redux/store";

// interface UpdateUserFormProps {
//   email?: string;
// }

// export default function UpdateUserForm({
//   email: propEmail,
// }: UpdateUserFormProps) {
//   // ✅ ALL HOOKS AT TOP LEVEL
//   const router = useRouter();
//   const dispatch = useDispatch();

//   // ✅ Redux state
//   const profile = useSelector((state: RootState) => state.profile);

//   // ✅ State
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
//         console.error("Banner fetch failed:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const bannerImage = data?.banner?.banner?.[0]?.image
//     ? `https://beljumlah-11072023-28562543.dev.odoo.com${data.banner.banner[0].image}`
//     : "";

//   // ============================================
//   // LOAD EMAIL FROM STORAGE
//   // ============================================

//   useEffect(() => {
//     let emailToUse = propEmail;

//     if (!emailToUse) {
//       const storedEmail = sessionStorage.getItem("profileEmail");
//       emailToUse = storedEmail || undefined;
//     }

//     if (!emailToUse) {
//       const storedEmail = sessionStorage.getItem("emailForOtp");
//       emailToUse = storedEmail || undefined;
//     }

//     if (emailToUse) {
//       setFormData((prev) => ({
//         ...prev,
//         email: emailToUse,
//       }));
//     }

//     // Validate auth token
//     const authToken = sessionStorage.getItem("auth_token");
//     if (!authToken) {
//       toast.error("Auth token missing. Please register again.");
//       router.push("/register");
//     }
//   }, [propEmail, router]);

//   // ============================================
//   // INPUT CHANGE HANDLER
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

//     if (!name || !phone) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     // ✅ Redux loading
//     dispatch(setLoading(true));

//     try {
//       const result = await addUserProfileData({
//         name,
//         phone,
//         email: formData.email,
//       });

//       console.log("✅ Profile Update Response:", result);

//       if (result?.status) {
//         // ✅ STORE IN REDUX
//         dispatch(
//           setProfileData({
//             name,
//             phone,
//             email: formData.email,
//           }),
//         );

//         toast.success("Profile completed!");
//         sessionStorage.clear();

//         // ✅ Redirect to login page (not home)
//         router.push("/login");
//       } else {
//         toast.error(result?.message || "Failed to save");
//       }
//     } catch (error) {
//       console.error("Profile save error:", error);
//       toast.error("Save failed");
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
//             />
//             <div className="absolute inset-0 bg-black/60"></div>
//           </>
//         ) : null}
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
//                 disabled
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
