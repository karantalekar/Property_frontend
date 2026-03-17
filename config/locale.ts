export type Language = "en" | "ar";

export const LANG_CONFIG = {
  en: {
    odoo: "en_US",
    dir: "ltr",
    label: "English",
  },
  ar: {
    odoo: "ar_001",
    dir: "rtl",
    label: "العربية",
  },
} as const;
