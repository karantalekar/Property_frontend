import { LANG_CONFIG, Language } from "@/config/locale";
import { apiCore } from "../apiCore";

export const getcitiesData = async (lang: Language, type?: string) => {
  const params = { lang: LANG_CONFIG[lang].odoo, type };
  const response = await apiCore("/get/city", params, "POST");
  return response?.result?.data;
};
export const getPropertiesData = async (lang: Language, type?: string) => {
  const params = { lang: LANG_CONFIG[lang].odoo, type };
  const response = await apiCore("/get/property_type", params, "POST");
  return response?.result?.data;
};
export const sectionApi = async (lang: Language, page?: string) => {
  const response = await apiCore(
    "/section",
    { lang: LANG_CONFIG[lang].odoo, page },
    "POST",
  );
  return response?.result?.data;
};

export const getAminitiesData = async (lang: Language, type?: string) => {
  const response = await apiCore(
    "/get/amenities",
    { lang: LANG_CONFIG[lang].odoo, type },
    "POST",
  );
  return response?.result?.data;
};

export const newsletterAPi = async (lang:Language,email: string,company_id:number|null) => {
  const response = await apiCore("/newsletter/", { lang:LANG_CONFIG[lang].odoo,email ,company_id}, "POST");
  return response;
};
