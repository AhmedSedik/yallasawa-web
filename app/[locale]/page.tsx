import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import HowItWorks from "@/components/HowItWorks";
import DownloadCTA from "@/components/DownloadCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("home_title"),
    description: t("home_description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: t("home_title"),
      description: t("home_description"),
      url: `${SITE_URL}/${locale}`,
    },
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "YallaSawa",
            operatingSystem: "Windows",
            applicationCategory: "EntertainmentApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "Synchronized video watch parties for Arabic streaming platforms like Shahid and Watch iT. Free Windows desktop app.",
            url: SITE_URL,
            image: `${SITE_URL}/images/app-icon.png`,
          }),
        }}
      />
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <DownloadCTA />
    </>
  );
}
