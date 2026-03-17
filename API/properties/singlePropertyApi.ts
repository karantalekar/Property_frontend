import { LANG_CONFIG, Language } from "@/config/locale";
import { apiCore } from "../apiCore";

export const getPropertyDetails = async (
  lang: Language,
  slug: string,
  company_id: number,
  customer_id?: number,
) => {
  const params = {
    lang: LANG_CONFIG[lang].odoo,
    slug,
    company_id,
    customer_id,
  };
  const response = await apiCore(`/get/product/${slug}`, params, "POST");
  return response.result.data;
};

export const getPropertyGallery = async (
  lang: Language,
  slug: string,
  type?: string,
  company_id?: number | null,
) => {
  const params = { lang: LANG_CONFIG[lang].odoo, type, company_id };
  const response = await apiCore(
    `/get/product/gallery/${slug}`,
    params,
    "POST",
  );
  return response?.result?.data;
};

export const addReview = async (
  lang: Language,
  slug: string,
  company_id: number,
  reviewData: {
    auth_token: string;
    product_id: number;
    // customer_id: number;
    rating: number;
    review?: string;
  },
) => {
  const params = {
    lang: LANG_CONFIG[lang].odoo,
    slug,
    company_id,
    ...reviewData,
  };
  const response = await apiCore(`/create/review`, params, "POST");
  return response.result;
};

export const getAvailability = async (
  lang: Language,
  slug: string,
  company_id: number,
  payload: any,
) => {
  const params = { lang: LANG_CONFIG[lang].odoo, slug, company_id, ...payload };
  const response = await apiCore(`/check-availability`, params, "POST");
  return response.result;
};

export const createBooking = async (lang: Language, payload: any) => {
  const params = { lang: LANG_CONFIG[lang].odoo, ...payload };
  const response = await apiCore(`/create-booking`, params, "POST");
  return response.result;
};

export const bookingHistory = async (lang: Language, customer_id: number) => {
  const response = await apiCore(
    `/customer/bookings`,
    { lang, customer_id },
    "POST",
  );
  return response.result;
};
