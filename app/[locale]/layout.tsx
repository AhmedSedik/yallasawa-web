import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { jakartaSans, vietnamPro, cairo } from "../fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { routing } from "@/i18n/routing";
import { getLatestRelease } from "@/lib/github";
import { ReleaseProvider } from "@/lib/ReleaseContext";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yalla-sawa.com"),
  title: "YallaSawa — Watch Together, No Matter Where",
  description:
    "Synchronized video watch parties with real-time chat. Download YallaSawa for Windows and watch together in perfect sync.",
  openGraph: {
    title: "YallaSawa — Watch Together, No Matter Where",
    description: "Watch videos together in perfect sync with real-time chat.",
    images: ["/images/yallasawa-brand-card.png"],
    type: "website",
    siteName: "YallaSawa",
  },
  twitter: {
    card: "summary_large_image",
    title: "YallaSawa — Watch Together, No Matter Where",
    description: "Watch videos together in perfect sync with real-time chat.",
    images: ["/images/yallasawa-brand-card.png"],
  },
  icons: {
    icon: "/images/yallasawa-icon-transparent.png",
  },
};

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
