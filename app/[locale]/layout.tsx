import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { jakartaSans, vietnamPro, cairo } from "../fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleHintBanner from "@/components/LocaleHintBanner";
import { routing, localeConfig, locales, type Locale } from "@/i18n/routing";
import { getLatestRelease } from "@/lib/github";
import { ReleaseProvider } from "@/lib/ReleaseContext";
import PageViewTracker from "@/components/PageViewTracker";
import { SITE_URL } from "@/lib/constants";
import { localizedAlternates } from "@/lib/metadata";
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
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) return {};
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const meta = localeConfig[locale];
  const alternateOgLocales = locales
    .filter((l) => l !== locale)
    .map((l) => localeConfig[l].ogLocale);

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
      locale: meta.ogLocale,
      alternateLocale: alternateOgLocales,
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
    alternates: localizedAlternates(locale, ""),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const meta = localeConfig[locale];

  const [messages, release] = await Promise.all([getMessages(), getLatestRelease()]);

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
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
              inLanguage: locales.map((l) => localeConfig[l].htmlLang),
            }),
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col ${meta.fontClass ?? ""}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ReleaseProvider release={release}>
            <PageViewTracker locale={locale} />
            <LocaleHintBanner currentLocale={locale} />
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </ReleaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
