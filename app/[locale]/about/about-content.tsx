"use client";

import { Zap, Shield, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";

export default function AboutContent() {
  const t = useTranslations("about");

  const differentiators = [
    { icon: Zap, titleKey: "sync_title", descKey: "sync_desc" },
    { icon: Shield, titleKey: "drm_title", descKey: "drm_desc" },
    { icon: UserCheck, titleKey: "setup_title", descKey: "setup_desc" },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center">
            <span className="inline-block rounded-full bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan">
              {t("badge")}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-text-primary md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-4 text-lg text-text-warm">{t("subheading")}</p>
          </div>
        </ScrollReveal>

        <div className="mt-20 grid gap-12 md:grid-cols-2 md:items-center">
          <ScrollReveal direction="left">
            <div>
              <h2 className="font-display text-2xl font-bold text-cyan">{t("story_heading")}</h2>
              <div className="mt-6 space-y-4 text-text-warm leading-relaxed">
                <p>{t("story_p1")}</p>
                <p>{t("story_p2")}</p>
                <p>{t("story_p3")}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="glass glass-border cyan-glow-sm rounded-xl p-2">
              <div className="flex h-64 items-center justify-center rounded-lg bg-surface-container">
                <p className="font-display text-lg text-outline">{t("app_preview")}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-24">
          <ScrollReveal>
            <h2 className="text-center font-display text-2xl font-bold text-text-primary md:text-3xl">
              {t("diff_heading")}
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {differentiators.map((item, i) => (
              <ScrollReveal key={item.titleKey} delay={i * 0.1}>
                <GlassCard className="h-full text-center">
                  <div className="mx-auto mb-4 inline-flex rounded-md bg-cyan/10 p-3">
                    <item.icon className="h-6 w-6 text-cyan" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-text-warm">{t(item.descKey)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <div className="mt-24 text-center">
            <h2 className="font-display text-2xl font-bold text-cyan">{t("creator_heading")}</h2>
            <p className="mt-4 max-w-lg mx-auto text-text-warm">{t("creator_desc")}</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/faq" className="text-sm font-medium text-cyan hover:underline">
                {t("read_faq")}
              </Link>
              <span className="text-outline">|</span>
              <Link href="/contact" className="text-sm font-medium text-cyan hover:underline">
                {t("get_in_touch")}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
