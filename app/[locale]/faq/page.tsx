import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates, localizedOgUrl } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import FAQContent from "./faq-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("faq_title"),
    description: t("faq_description"),
    alternates: localizedAlternates(locale, "/faq"),
    openGraph: {
      title: t("faq_title"),
      description: t("faq_description"),
      url: localizedOgUrl(locale, "/faq"),
    },
  };
}

const faqKeys = [
  "q_what_is", "q_install", "q_platforms", "q_free",
  "q_create_party", "q_sync", "q_any_video", "q_queue",
  "q_drm", "q_latency", "q_secure",
  "q_legal", "q_host_content", "q_data_collect",
] as const;

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqKeys.map((qKey) => {
      const aKey = qKey.replace("q_", "a_");
      return {
        "@type": "Question",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: t(qKey as any),
        acceptedAnswer: {
          "@type": "Answer",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          text: t(aKey as any),
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQContent />
    </>
  );
}
