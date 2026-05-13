import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/changelog", changeFrequency: "weekly" as const, priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      const languages = Object.fromEntries([
        ...locales.map((l) => [l, `${SITE_URL}/${l}${page.path}`]),
        ["x-default", `${SITE_URL}/${defaultLocale}${page.path}`],
      ]);

      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
