import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import TermsContent from "./terms-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("terms_title"),
    description: t("terms_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms`,
      languages: {
        en: `${SITE_URL}/en/terms`,
        ar: `${SITE_URL}/ar/terms`,
        "x-default": `${SITE_URL}/en/terms`,
      },
    },
    openGraph: {
      title: t("terms_title"),
      description: t("terms_description"),
      url: `${SITE_URL}/${locale}/terms`,
    },
  };
}

export default function TermsPage() {
  return <TermsContent />;
}
