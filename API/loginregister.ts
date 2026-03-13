import { apiFetcher } from "./api-fetcher";

// Register User
export async function sendRegisterData({ email }: { email: any }) {
  try {
    const result = await apiFetcher("/registration/otp/", {
      company_id: 10,
      email: email,
      lang: "en_001",
    });

    // console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Verify Otp at Registration
export async function verifyOtpData({ email, otp }: { email: any; otp: any }) {
  try {
    const result = await apiFetcher("/verify/otp/", {
      company_id: 10,
      email: email,
      lang: "en_US",
      otp: otp,
    });

    // console.log("OTP Verified:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Send login OTP
export async function sendLoginOtpData({ email }: { email: any }) {
  try {
    const result = await apiFetcher("/login/otp/", {
      company_id: 10,
      email: email,
      lang: "en_001",
    });

    // console.log("Login OTP Sent:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Login User
export async function loginUserData({ email, otp }: { email: any; otp: any }) {
  try {
    const result = await apiFetcher("/login/", {
      company_id: 10,
      email: email,
      otp: otp,
      lang: "en_001",
    });

    // console.log("Login Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
