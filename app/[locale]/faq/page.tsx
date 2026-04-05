import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import FAQContent from "./faq-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("faq_title"),
    description: t("faq_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq`,
      languages: {
        en: `${SITE_URL}/en/faq`,
        ar: `${SITE_URL}/ar/faq`,
        "x-default": `${SITE_URL}/en/faq`,
      },
    },
    openGraph: {
      title: t("faq_title"),
      description: t("faq_description"),
      url: `${SITE_URL}/${locale}/faq`,
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
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqKeys.map((qKey) => {
      const aKey = qKey.replace("q_", "a_");
      return {
        "@type": "Question",
        name: t(qKey),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(aKey),
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
