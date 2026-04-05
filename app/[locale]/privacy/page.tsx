import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import PrivacyContent from "./privacy-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("privacy_title"),
    description: t("privacy_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        en: `${SITE_URL}/en/privacy`,
        ar: `${SITE_URL}/ar/privacy`,
        "x-default": `${SITE_URL}/en/privacy`,
      },
    },
    openGraph: {
      title: t("privacy_title"),
      description: t("privacy_description"),
      url: `${SITE_URL}/${locale}/privacy`,
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
