// import { apiFetcher } from "@/API/api-fetcher";
// import { getAuthToken } from "@/hooks/useAuthToken";
// import { store } from "@/redux/store"; // Your store path

// // =================================================================================================
// // ✅ getUserProfile - READ MODE
// export async function getUserProfile() {
//   try {
//     const auth_token = getToken();
//     if (!auth_token) {
//       return { status: false, message: "Auth token missing" };
//     }

//     console.log("✅ Using token: YES");

//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       auth_token,
//       is_register: false, // 🔥 READ MODE (not create)
//       name: "",
//       phone: "",
//       email: "",
//       lang: "en_001",
//     });

//     console.log("✅ Profile data:", result);
//     return result;
//   } catch (error) {
//     console.error("Profile fetch failed:", error);
//     return { status: false, message: "Failed to fetch profile" };
//   }
// }

// // ✅ updateUserProfile - UPDATE MODE
// export async function updateUserProfile({ name, phone }) {
//   try {
//     const auth_token = getToken();
//     if (!auth_token) throw new Error("Auth token missing");

//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       auth_token,
//       is_register: false, // 🔥 UPDATE MODE (not create)
//       name: name.trim(),
//       phone: phone.trim(),
//       email: "",
//       lang: "en_001",
//     });

//     console.log("✅ Profile updated:", result);
//     return result;
//   } catch (error) {
//     console.error("Profile update failed:", error);
//     throw error;
//   }
// }

import { apiFetcher } from "@/API/api-fetcher";
import { getAuthToken } from "@/hooks/useAuthToken";
import { store } from "@/redux/store";

// ✅ TOKEN HELPER - NOW DEFINED
const getToken = () =>
  store.getState().auth.token || localStorage.getItem("auth_token");

// ✅ getUserProfile - READ MODE
export async function getUserProfile() {
  try {
    const auth_token = getToken(); // ✅ Now defined!
    if (!auth_token) {
      return { status: false, message: "Auth token missing" };
    }

    console.log("✅ Using token: YES");

    const result = await apiFetcher("/update/profile/", {
      company_id: 10,
      email: "",
      auth_token,
      is_register: false, // 🔥 READ MODE
      name: "",
      phone: "",
      lang: "en_001",
    });

    console.log("✅ Profile data:", result);
    return result;
  } catch (error) {
    console.error("Profile fetch failed:", error);
    return { status: false, message: "Failed to fetch profile" };
  }
}

// //  updateUserProfile - UPDATE MODE
// export async function updateUserProfile({ name, phone }) {
//   const authEmail = store.getState().auth.user?.email;
//   try {
//     const auth_token = getToken();
//     if (!auth_token) throw new Error("Auth token missing");

//     const result = await apiFetcher("/update/profile/", {
//       company_id: 10,
//       email: authemail,
//       auth_token,
//       is_register: false, //  UPDATE MODE
//       name: name.trim(),
//       phone: phone.trim(),
//       lang: "en_001",
//     });

//     console.log(" Profile updated:", result);
//     return result;
//   } catch (error) {
//     console.error("Profile update failed:", error);
//     throw error;
//   }
// }

export async function updateUserProfile({
  name,
  phone,
}: {
  name: any;
  phone: any;
}) {
  const authEmail = store.getState().auth.user?.email; // ✅ From Redux auth slice
  try {
    const auth_token = getToken();
    if (!auth_token) throw new Error("Auth token missing");

    console.log("🔍 Sending email:", authEmail); // DEBUG

    const result = await apiFetcher("/update/profile/", {
      company_id: 10,
      email: authEmail, // ✅ FIXED: authEmail (not authemail)
      auth_token,
      is_register: false,
      name: name.trim(),
      phone: phone.trim(),
      lang: "en_001",
    });

    console.log("✅ Profile updated:", result);
    return result;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error;
  }
}

// ===================================================================
export async function addUserProfileData({
  name,
  phone,
  email, // Optional: pass email if backend needs it
}: {
  name: string;
  phone: string;
  email?: string;
}) {
  try {
    // const auth_token = sessionStorage.getItem("auth_token");
    const auth_token = getToken();

    const payload = {
      company_id: 10,
      email: email,
      auth_token: auth_token,
      is_register: true,
      name: name.trim(),
      phone: phone.trim(),
      lang: "en_001",
    };

    const result = await apiFetcher("/update/profile/", payload, "POST");
    console.log(result); //  Always return result
    return result;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error; //  Re-throw for component to handle
  }
}
