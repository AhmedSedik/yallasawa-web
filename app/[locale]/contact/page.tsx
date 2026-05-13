import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, localizedOgUrl } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import ContactContent from "./contact-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("contact_title"),
    description: t("contact_description"),
    alternates: localizedAlternates(locale, "/contact"),
    openGraph: {
      title: t("contact_title"),
      description: t("contact_description"),
      url: localizedOgUrl(locale, "/contact"),
    },
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
