import { LANG_CONFIG, Language } from "@/config/locale";
import { apiCore } from "@/API/apiCore";

export const headerApi = async (lang: Language) => {
  const response = await apiCore(
    "/header",
    { lang: LANG_CONFIG[lang].odoo },
    "POST",
  );
  return response.result;
};

export const footerApi = async (lang: Language) => {
  const response = await apiCore(
    "/footer",
    { lang: LANG_CONFIG[lang].odoo },
    "POST",
  );
  return response?.result?.data;
};
