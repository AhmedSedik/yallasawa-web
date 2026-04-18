import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import ChangelogContent from "./changelog-content";

const CHANGELOG_API =
  "https://yallaforgaserver-production.up.railway.app/api/changelog";

interface ChangelogSection {
  type: "Added" | "Changed" | "Fixed";
  items: string[];
}

interface ChangelogEntry {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

async function getChangelog(): Promise<ChangelogEntry[]> {
  try {
    const res = await fetch(CHANGELOG_API, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

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

export default async function ChangelogPage() {
  const entries = await getChangelog();
  return <ChangelogContent entries={entries} />;
}
