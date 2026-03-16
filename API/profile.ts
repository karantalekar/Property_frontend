// import { apiFetcher } from "@/API/api-fetcher";
// import { store } from "@/redux/store";

// /**
//  * ✅ HELPER: Get token from Redux only
//  */
// const getToken = (): string | null => {
//   const reduxToken = store.getState().auth.auth_token;
//   return reduxToken || null;
// };

// /**
//  * ✅ GET USER PROFILE - READ MODE
//  * NOW SENDS: email field (required by backend)
//  */
// export async function getUserProfile() {
//   try {
//     const auth_token = getToken();
//     if (!auth_token) {
//       console.error("❌ Auth token missing");
//       return { status: false, message: "Auth token missing" };
//     }

//     const userEmail = store.getState().auth.user?.email || "";

//     if (!userEmail) {
//       console.error("❌ User email not found in Redux");
//       return { status: false, message: "User email missing" };
//     }

//     console.log("✅ Fetching profile with email:", userEmail);

//     // ✅ SEND: company_id, auth_token, email, is_register: false
//     // The backend needs email to identify the user!
//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       auth_token,
//       email: userEmail, // ✅ From Redux state
//       is_register: false, // ✅ READ MODE
//       name: "",
//       phone: "",
//       lang: "en_001",
//     });

//     // console.log("✅ Profile fetched successfully:", result);

//     return result;
//   } catch (error) {
//     console.error("❌ Profile fetch failed:", error);
//     return { status: false, message: "Failed to fetch profile" };
//   }
// }

// /**
//  * ✅ UPDATE USER PROFILE - UPDATE MODE
//  * Updates existing user profile (name, phone only)
//  */
// export async function updateUserProfile({
//   name,
//   phone,
// }: {
//   name: string;
//   phone: string;
// }) {
//   const authEmail = store.getState().auth.user?.email;

//   try {
//     const auth_token = getToken();
//     if (!auth_token) {
//       console.error("❌ Auth token missing for update");
//       throw new Error("Auth token missing");
//     }

//     if (!authEmail) {
//       console.error("❌ Email not found in auth state");
//       throw new Error("Email not found");
//     }

//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       email: authEmail,
//       auth_token,
//       is_register: false,
//       name: name.trim(),
//       phone: phone.trim(),
//       lang: "en_001",
//     });

//     console.log("✅ Profile updated successfully:", result);
//     return result;
//   } catch (error) {
//     console.error("❌ Profile update failed:", error);
//     throw error;
//   }
// }

// /**
//  * ✅ ADD USER PROFILE DATA - CREATE MODE
//  * Creates new user profile after OTP verification
//  */
// export async function addUserProfileData({
//   name,
//   phone,
//   email,
// }: {
//   name: string;
//   phone: string;
//   email?: string;
// }) {
//   try {
//     const auth_token = getToken();

//     if (!auth_token) {
//       console.error("❌ Auth token is missing!");
//       throw new Error("Auth token missing. Please verify OTP again.");
//     }

//     if (!email) {
//       console.error("❌ Email is required");
//       throw new Error("Email is required");
//     }

//     if (!name || !name.trim()) {
//       console.error("❌ Name is required");
//       throw new Error("Name is required");
//     }

//     if (!phone || !phone.trim()) {
//       console.error("❌ Phone is required");
//       throw new Error("Phone is required");
//     }

//     const payload = {
//       company_id: 10,
//       email: email.trim(),
//       auth_token,
//       is_register: true, // ✅ CREATE MODE
//       name: name.trim(),
//       phone: phone.trim(),
//       lang: "en_001",
//     };

//     console.log("📤 Sending create profile payload");

//     const result = await apiFetcher("/update/profile/", payload, "POST");

//     console.log("✅ Profile created successfully:", result);
//     return result;
//   } catch (error) {
//     console.error("❌ Profile creation failed:", error);
//     throw error;
//   }
// }

import { apiFetcher } from "@/API/api-fetcher";
import { store } from "@/redux/store";

const COMPANY_ID = 10;
const LANG = "en_001";

/**
 * Get auth token from Redux
 */
const getToken = (): string | null => {
  return store.getState().auth?.auth_token || null;
};

/**
 * Get user email from Redux
 */
const getUserEmail = (): string | null => {
  return store.getState().auth?.user?.email || null;
};

/**
 * Validate auth before API calls
 */
const validateAuth = () => {
  const auth_token = getToken();
  const email = getUserEmail();

  if (!auth_token) throw new Error("Auth token missing");
  if (!email) throw new Error("User email missing");

  return { auth_token, email };
};

/**
 * ============================
 * GET USER PROFILE
 * ============================
 */
export async function getUserProfile() {
  try {
    const { auth_token, email } = validateAuth();

    const result = await apiFetcher("/update/profile/", {
      company_id: COMPANY_ID,
      auth_token,
      email,
      is_register: false,
      name: "",
      phone: "",
      lang: LANG,
    });

    return result;
  } catch (error) {
    console.error("❌ Profile fetch failed:", error);
    return { status: false, message: "Failed to fetch profile" };
  }
}

/**
 * ============================
 * UPDATE USER PROFILE
 * ============================
 */
export async function updateUserProfile({
  name,
  phone,
}: {
  name: string;
  phone: string;
}) {
  try {
    const { auth_token, email } = validateAuth();

    const result = await apiFetcher("/update/profile/", {
      company_id: COMPANY_ID,
      email,
      auth_token,
      is_register: false,
      name: name.trim(),
      phone: phone.trim(),
      lang: LANG,
    });

    return result;
  } catch (error) {
    console.error("❌ Profile update failed:", error);
    throw error;
  }
}

/**
 * ============================
 * CREATE USER PROFILE
 * ============================
 */
export async function addUserProfileData({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email: string;
}) {
  try {
    const auth_token = getToken();

    if (!auth_token) {
      throw new Error("Auth token missing. Please verify OTP again.");
    }

    if (!name.trim()) throw new Error("Name is required");
    if (!phone.trim()) throw new Error("Phone is required");
    if (!email.trim()) throw new Error("Email is required");

    const result = await apiFetcher(
      "/update/profile/",
      {
        company_id: COMPANY_ID,
        email: email.trim(),
        auth_token,
        is_register: true,
        name: name.trim(),
        phone: phone.trim(),
        lang: LANG,
      },
      "POST",
    );

    return result;
  } catch (error) {
    console.error("❌ Profile creation failed:", error);
    throw error;
  }
}
