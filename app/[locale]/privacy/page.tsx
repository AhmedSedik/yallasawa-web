import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, localizedOgUrl } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import PrivacyContent from "./privacy-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("privacy_title"),
    description: t("privacy_description"),
    alternates: localizedAlternates(locale, "/privacy"),
    openGraph: {
      title: t("privacy_title"),
      description: t("privacy_description"),
      url: localizedOgUrl(locale, "/privacy"),
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
