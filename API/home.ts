import { apiFetcher } from "@/API/api-fetcher";

export async function getFooterData() {
  const result = await apiFetcher("/footer", {
    lang: "en_001",
    company_id: 10,
  });
  return result?.data || [];
}

export async function getHeaderData() {
  const result = await apiFetcher("/header", { lang: "er_001" }, "POST");
  return {
    headers: result?.data || [],
    company: result?.company_details || {},
  };
}

export async function getHomeData() {
  const result = await apiFetcher("/section", {
    lang: "en_001",
    page: "home_page",
  });

  return result?.data || {};
}

// API/contactForm.js
export async function sendContactData({
  name,
  phone,
  email,
  message,
}: {
  name: any;
  phone: any;
  email: any;
  message: any;
}) {
  try {
    const result = await apiFetcher("/contactus", {
      name: name,
      phone: phone,
      email: email,
      message: message,
      company_id: 10,
    });

    // console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getContactData() {
  const result = await apiFetcher("/section", {
    lang: "en_001",
    page: "contact_us",
  });

  return result?.data || {};
}

export async function getPropertyData() {
  try {
    const result = await apiFetcher("/section", {
      lang: "en_001",
      page: "properties",
    });

    const data = result?.data || {};

    const properties =
      data?.banner?.banner ||
      data?.properties ||
      data?.list ||
      data?.items ||
      data ||
      [];

    return Array.isArray(properties) ? properties : [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
export async function getCityData() {
  try {
    const result = await apiFetcher("/get/city", {
      lang: "en_001",
    });

    return result?.data || [];
  } catch (error) {
    console.error("City fetch error:", error);
    return [];
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    const response = await apiFetcher("/newsletter/", {
      company_id: 4,
      email: email,
    });

    console.log("Newsletter API Response:", response);

    return response;
  } catch (error: any) {
    console.error("Newsletter subscription error:", error?.message);
    throw new Error(error?.message || "Newsletter subscription failed");
  }
}
