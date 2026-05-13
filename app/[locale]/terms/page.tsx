import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, localizedOgUrl } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import TermsContent from "./terms-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("terms_title"),
    description: t("terms_description"),
    alternates: localizedAlternates(locale, "/terms"),
    openGraph: {
      title: t("terms_title"),
      description: t("terms_description"),
      url: localizedOgUrl(locale, "/terms"),
    },
  };
}

export default function TermsPage() {
  return <TermsContent />;
}
