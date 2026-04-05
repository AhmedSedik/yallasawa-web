import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import ContactContent from "./contact-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("contact_title"),
    description: t("contact_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: {
        en: `${SITE_URL}/en/contact`,
        ar: `${SITE_URL}/ar/contact`,
        "x-default": `${SITE_URL}/en/contact`,
      },
    },
    openGraph: {
      title: t("contact_title"),
      description: t("contact_description"),
      url: `${SITE_URL}/${locale}/contact`,
    },
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
