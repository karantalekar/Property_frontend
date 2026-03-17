import { LANG_CONFIG, Language } from "@/config/locale";
import { apiCore } from "../apiCore";

export const getBlogs = async (
  lang: Language,
  page?: number,
  page_size?: number,
  show_on_homepage?: boolean,
) => {
  const params = {
    lang: LANG_CONFIG[lang].odoo,
    page,
    page_size,
    show_on_homepage,
  };
  const response = await apiCore("/blogs/lists", params, "POST");
  return response.result;
};

export const getSingleBlog = async (lang: Language, slug: string) => {
  const params = { lang: LANG_CONFIG[lang].odoo, slug };
  const response = await apiCore("/blog", params, "POST");
  return response.result;
};
