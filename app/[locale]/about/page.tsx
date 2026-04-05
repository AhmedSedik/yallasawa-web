import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import AboutContent from "./about-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("about_title"),
    description: t("about_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: {
        en: `${SITE_URL}/en/about`,
        ar: `${SITE_URL}/ar/about`,
        "x-default": `${SITE_URL}/en/about`,
      },
    },
    openGraph: {
      title: t("about_title"),
      description: t("about_description"),
      url: `${SITE_URL}/${locale}/about`,
    },
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
