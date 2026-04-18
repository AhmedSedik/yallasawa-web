import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import ChangelogContent from "./changelog-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("changelog_title"),
    description: t("changelog_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/changelog`,
      languages: {
        en: `${SITE_URL}/en/changelog`,
        ar: `${SITE_URL}/ar/changelog`,
        "x-default": `${SITE_URL}/en/changelog`,
      },
    },
    openGraph: {
      title: t("changelog_title"),
      description: t("changelog_description"),
      url: `${SITE_URL}/${locale}/changelog`,
    },
  };
}

export default function ChangelogPage() {
  return <ChangelogContent />;
}
