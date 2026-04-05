import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { jakartaSans, vietnamPro, cairo } from "../fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { routing } from "@/i18n/routing";
import { getLatestRelease } from "@/lib/github";
import { ReleaseProvider } from "@/lib/ReleaseContext";
import { SITE_URL } from "@/lib/constants";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("home_title"),
      template: `%s`,
    },
    description: t("home_description"),
    openGraph: {
      title: t("home_title"),
      description: t("home_description"),
      siteName: t("site_name"),
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      images: [
        {
          url: "/images/yallasawa-brand-card.png",
          width: 1200,
          height: 630,
          alt: t("home_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("home_title"),
      description: t("home_description"),
      images: [
        {
          url: "/images/yallasawa-brand-card.png",
          width: 1200,
          height: 630,
          alt: t("home_title"),
        },
      ],
    },
    icons: {
      icon: "/images/yallasawa-icon-transparent.png",
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [messages, release] = await Promise.all([getMessages(), getLatestRelease()]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${jakartaSans.variable} ${vietnamPro.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2783833750870363"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "YallaSawa",
              url: SITE_URL,
              inLanguage: [locale === "ar" ? "ar" : "en"],
            }),
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col ${locale === "ar" ? "font-arabic" : ""}`}>
        <NextIntlClientProvider messages={messages}>
          <ReleaseProvider release={release}>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </ReleaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
