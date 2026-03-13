// import { apiFetcher } from "@/API/api-fetcher";
// import { getAuthToken } from "@/hooks/useAuthToken";
// import { store } from "@/redux/store";

// /**
//  * ✅ HELPER: Get token from Redux or localStorage
//  */
// const getToken = (): string | null => {
//   const reduxToken = store.getState().auth.auth_token;
//   if (reduxToken) return reduxToken;
//   return localStorage.getItem("auth_token");
// };

// /**
//  * ✅ GET USER PROFILE - READ MODE
//  * Fetches current user profile from backend
//  */
// export async function getUserProfile() {
//   try {
//     const auth_token = getToken();
//     if (!auth_token) {
//       console.error("❌ Auth token missing");
//       return { status: false, message: "Auth token missing" };
//     }

//     console.log("✅ Fetching profile with valid token");

//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       auth_token,
//       is_register: false, // ✅ READ MODE
//       email: "",
//       name: "",
//       phone: "",
//       lang: "en_001",
//     });

//     console.log("✅ Profile fetched successfully:", result);
//     return result;
//   } catch (error) {
//     console.error("❌ Profile fetch failed:", error);
//     return { status: false, message: "Failed to fetch profile" };
//   }
// }

// /**
//  * ✅ UPDATE USER PROFILE - UPDATE MODE
//  * Updates existing user profile (name, phone only)
//  * Used after profile is already created
//  */
// export async function updateUserProfile({
//   name,
//   phone,
// }: {
//   name: string;
//   phone: string;
// }) {
//   // Get email from Redux auth state
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

//     console.log("🔍 Updating profile");
//     console.log("  - Email:", authEmail);
//     console.log("  - Name:", name);
//     console.log("  - Phone:", phone);

//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       email: authEmail, // ✅ From Redux state
//       auth_token,
//       is_register: false, // ✅ UPDATE MODE
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
//  * Called during registration flow
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
//     // Get token from Redux or localStorage
//     const auth_token = getToken();

//     // Debug logging
//     console.log("🔍 Creating user profile");
//     console.log("  - Redux token:", !!store.getState().auth.auth_token);
//     console.log(
//       "  - localStorage token:",
//       !!localStorage.getItem("auth_token"),
//     );
//     console.log("  - Final token:", !!auth_token);

//     // Validate token exists
//     if (!auth_token) {
//       console.error("❌ Auth token is missing!");
//       throw new Error("Auth token missing. Please verify OTP again.");
//     }

//     // Validate required fields
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

//     // Build payload
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

//     // Send API request
//     const result = await apiFetcher("/update/profile/", payload, "POST");

//     console.log("✅ Profile created successfully:", result);
//     return result;
//   } catch (error) {
//     console.error("❌ Profile creation failed:", error);
//     throw error;
//   }
// }

// /**
//  * ✅ DELETE USER PROFILE
//  * Optional: Delete user profile
//  */
// export async function deleteUserProfile() {
//   try {
//     const auth_token = getToken();
//     if (!auth_token) {
//       throw new Error("Auth token missing");
//     }

//     const result = await apiFetcher("/delete/profile/", {
//       company_id: 10,
//       auth_token,
//       lang: "en_001",
//     });

//     console.log("✅ Profile deleted:", result);
//     return result;
//   } catch (error) {
//     console.error("❌ Profile deletion failed:", error);
//     throw error;
//   }
// }

import { apiFetcher } from "@/API/api-fetcher";
import { getAuthToken } from "@/hooks/useAuthToken";
import { store } from "@/redux/store";

/**
 * ✅ HELPER: Get token from Redux or localStorage
 */
const getToken = (): string | null => {
  const reduxToken = store.getState().auth.auth_token;
  if (reduxToken) return reduxToken;
  return localStorage.getItem("auth_token");
};

/**
 * ✅ GET USER PROFILE - READ MODE (FIXED v2)
 * NOW SENDS: email field (required by backend)
 */
export async function getUserProfile() {
  try {
    const auth_token = getToken();
    if (!auth_token) {
      console.error("❌ Auth token missing");
      return { status: false, message: "Auth token missing" };
    }

    const userEmail =
      store.getState().auth.user?.email ||
      localStorage.getItem("user_email") ||
      "";

    console.log("✅ Fetching profile with email:", userEmail);

    // ✅ SEND: company_id, auth_token, email, is_register: false
    // The backend needs email to identify the user!
    const result = await apiFetcher("/update/profile/", {
      company_id: 10,
      auth_token,
      email: userEmail, // ✅ REQUIRED - identifies the user
      is_register: false, // ✅ READ MODE
      name: "",
      phone: "",
      lang: "en_001",
    });

    console.log("✅ Profile fetched successfully:", result);

    return result;
  } catch (error) {
    console.error("❌ Profile fetch failed:", error);
    return { status: false, message: "Failed to fetch profile" };
  }
}

/**
 * ✅ UPDATE USER PROFILE - UPDATE MODE
 * Updates existing user profile (name, phone only)
 */
export async function updateUserProfile({
  name,
  phone,
}: {
  name: string;
  phone: string;
}) {
  const authEmail = store.getState().auth.user?.email;

  try {
    const auth_token = getToken();
    if (!auth_token) {
      console.error("❌ Auth token missing for update");
      throw new Error("Auth token missing");
    }

    if (!authEmail) {
      console.error("❌ Email not found in auth state");
      throw new Error("Email not found");
    }

    console.log("🔍 Updating profile");
    console.log("  - Email:", authEmail);
    console.log("  - Name:", name);
    console.log("  - Phone:", phone);

    const result = await apiFetcher("/update/profile/", {
      company_id: 10,
      email: authEmail,
      auth_token,
      is_register: false,
      name: name.trim(),
      phone: phone.trim(),
      lang: "en_001",
    });

    console.log("✅ Profile updated successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Profile update failed:", error);
    throw error;
  }
}

/**
 * ✅ ADD USER PROFILE DATA - CREATE MODE
 * Creates new user profile after OTP verification
 */
export async function addUserProfileData({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email?: string;
}) {
  try {
    const auth_token = getToken();

    console.log("🔍 Creating user profile");
    console.log("  - Email:", email);
    console.log("  - Name:", name);
    console.log("  - Phone:", phone);

    if (!auth_token) {
      console.error("❌ Auth token is missing!");
      throw new Error("Auth token missing. Please verify OTP again.");
    }

    if (!email) {
      console.error("❌ Email is required");
      throw new Error("Email is required");
    }

    if (!name || !name.trim()) {
      console.error("❌ Name is required");
      throw new Error("Name is required");
    }

    if (!phone || !phone.trim()) {
      console.error("❌ Phone is required");
      throw new Error("Phone is required");
    }

    const payload = {
      company_id: 10,
      email: email.trim(),
      auth_token,
      is_register: true, // ✅ CREATE MODE
      name: name.trim(),
      phone: phone.trim(),
      lang: "en_001",
    };

    console.log("📤 Sending create profile payload");

    const result = await apiFetcher("/update/profile/", payload, "POST");

    console.log("✅ Profile created successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Profile creation failed:", error);
    throw error;
  }
}
