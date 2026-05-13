import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

type LocaleMeta = {
  label: string;
  dir: "ltr" | "rtl";
  ogLocale: string;
  htmlLang: string;
  dateLocale: string;
  fontClass?: string;
};

export const localeConfig: Record<Locale, LocaleMeta> = {
  en: {
    label: "English",
    dir: "ltr",
    ogLocale: "en_US",
    htmlLang: "en",
    dateLocale: "en-US",
  },
  ar: {
    label: "العربية",
    dir: "rtl",
    ogLocale: "ar_SA",
    htmlLang: "ar",
    dateLocale: "ar-EG",
    fontClass: "font-arabic",
  },
  de: {
    label: "Deutsch",
    dir: "ltr",
    ogLocale: "de_DE",
    htmlLang: "de",
    dateLocale: "de-DE",
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const routing = defineRouting({
  locales,
  defaultLocale,
});
