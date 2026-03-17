import { LANG_CONFIG, Language } from "@/config/locale";
import { apiCore } from "../apiCore";

export const termsAndConditionsApi = async (
  lang: Language,
  pageType: string,
) => {
  const response = await apiCore(
    "/pg",
    { lang: LANG_CONFIG[lang].odoo, page_type: pageType },
    "POST",
  );
  return response;
};
