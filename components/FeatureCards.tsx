"use client";

import { Play, Users, MessageSquare, ListVideo } from "lucide-react";
import { useTranslations } from "next-intl";
import { GlassCard } from "./GlassCard";
import { ScrollReveal } from "./ScrollReveal";

export default function FeatureCards() {
  const t = useTranslations("features");

  const features = [
    { icon: Play, titleKey: "sync_title", descKey: "sync_desc" },
    { icon: Users, titleKey: "rooms_title", descKey: "rooms_desc" },
    { icon: MessageSquare, titleKey: "chat_title", descKey: "chat_desc" },
    { icon: ListVideo, titleKey: "queue_title", descKey: "queue_desc" },
  ];

  return (
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-bold text-text-primary md:text-4xl">
            {t("heading")}{" "}
            <span className="text-cyan">{t("heading_accent")}</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.titleKey} delay={i * 0.1}>
              <GlassCard className="h-full">
                <div className="mb-4 inline-flex rounded-md bg-cyan/10 p-3">
                  <feature.icon className="h-6 w-6 text-cyan" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {t(feature.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-warm">
                  {t(feature.descKey)}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
