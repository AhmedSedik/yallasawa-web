import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

export function localizedAlternates(
  locale: Locale,
  path: string = ""
): NonNullable<Metadata["alternates"]> {
  const normalized = path && !path.startsWith("/") ? `/${path}` : path;
  const languages = Object.fromEntries([
    ...locales.map((l) => [l, `${SITE_URL}/${l}${normalized}`]),
    ["x-default", `${SITE_URL}/${defaultLocale}${normalized}`],
  ]);

  return {
    canonical: `${SITE_URL}/${locale}${normalized}`,
    languages,
  };
}

export function localizedOgUrl(locale: Locale, path: string = "") {
  const normalized = path && !path.startsWith("/") ? `/${path}` : path;
  return `${SITE_URL}/${locale}${normalized}`;
}
