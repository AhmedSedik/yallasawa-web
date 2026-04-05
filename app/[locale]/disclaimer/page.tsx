import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import DisclaimerContent from "./disclaimer-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("disclaimer_title"),
    description: t("disclaimer_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/disclaimer`,
      languages: {
        en: `${SITE_URL}/en/disclaimer`,
        ar: `${SITE_URL}/ar/disclaimer`,
        "x-default": `${SITE_URL}/en/disclaimer`,
      },
    },
    openGraph: {
      title: t("disclaimer_title"),
      description: t("disclaimer_description"),
      url: `${SITE_URL}/${locale}/disclaimer`,
    },
  };
}

export default function DisclaimerPage() {
  return <DisclaimerContent />;
}
