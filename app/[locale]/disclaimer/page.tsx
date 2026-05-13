import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, localizedOgUrl } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import DisclaimerContent from "./disclaimer-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("disclaimer_title"),
    description: t("disclaimer_description"),
    alternates: localizedAlternates(locale, "/disclaimer"),
    openGraph: {
      title: t("disclaimer_title"),
      description: t("disclaimer_description"),
      url: localizedOgUrl(locale, "/disclaimer"),
    },
  };
}

export default function DisclaimerPage() {
  return <DisclaimerContent />;
}
