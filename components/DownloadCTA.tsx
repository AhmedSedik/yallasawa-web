"use client";

import { Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { DownloadButton } from "./DownloadButton";
import { ScrollReveal } from "./ScrollReveal";

export default function DownloadCTA() {
  const t = useTranslations("download_cta");

  return (
    <section className="relative overflow-hidden px-6 py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-cyan/6 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-5xl">
            {t("heading")}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-4 text-lg text-text-warm">
            {t("subheading")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <DownloadButton size="large" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-outline">
              <Smartphone className="h-4 w-4" />
              <span>{t("android")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-outline">
              <Smartphone className="h-4 w-4" />
              <span>{t("ios")}</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
