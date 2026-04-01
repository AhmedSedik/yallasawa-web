"use client";

import { Download, PlusCircle, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

export default function HowItWorks() {
  const t = useTranslations("how_it_works");

  const steps = [
    { icon: Download, number: 1, titleKey: "step1_title", descKey: "step1_desc" },
    { icon: PlusCircle, number: 2, titleKey: "step2_title", descKey: "step2_desc" },
    { icon: Play, number: 3, titleKey: "step3_title", descKey: "step3_desc" },
  ];

  return (
    <section className="relative px-6 py-24 bg-surface-lowest">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-bold text-text-primary md:text-4xl">
            {t("heading")}{" "}
            <span className="text-cyan">{t("heading_accent")}</span>
          </h2>
        </ScrollReveal>

        <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute top-14 start-[16.5%] end-[16.5%] hidden h-px md:block">
            <div className="h-full w-full bg-cyan opacity-30" />
          </div>

          {steps.map((step, i) => (
            <ScrollReveal key={step.titleKey} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                {/* Numbered circle */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cyan">
                  <span className="font-display text-xl font-bold text-surface-base">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-md bg-glass">
                  <step.icon className="h-6 w-6 text-cyan" />
                </div>

                {/* Text */}
                <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 text-sm text-text-warm">
                  {t(step.descKey)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
