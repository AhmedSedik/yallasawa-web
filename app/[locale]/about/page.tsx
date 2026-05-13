import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, localizedOgUrl } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import AboutContent from "./about-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("about_title"),
    description: t("about_description"),
    alternates: localizedAlternates(locale, "/about"),
    openGraph: {
      title: t("about_title"),
      description: t("about_description"),
      url: localizedOgUrl(locale, "/about"),
    },
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
