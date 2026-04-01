"use client";

import { Mail, Shield, Clock, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import ContactForm from "@/components/ContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";
import Link from "next/link";

export default function ContactPage() {
  const t = useTranslations("contact");

  const contactCards = [
    {
      icon: Mail,
      title: t("general_support"),
      detail: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: Shield,
      title: t("privacy_legal"),
      detail: LEGAL_EMAIL,
      href: `mailto:${LEGAL_EMAIL}`,
    },
    {
      icon: Clock,
      title: t("response_time"),
      detail: t("response_detail"),
    },
    {
      icon: HelpCircle,
      title: t("quick_answers"),
      detail: t("quick_detail"),
      href: "/faq",
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan">
              {t("badge")}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-text-primary md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-4 text-lg text-text-warm">{t("subheading")}</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3">
            <ScrollReveal>
              <ContactForm />
            </ScrollReveal>
          </div>

          <div className="space-y-4 md:col-span-2">
            {contactCards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.08}>
                <GlassCard hover={false} className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-md bg-cyan/10 p-2.5">
                    <card.icon className="h-5 w-5 text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-text-primary">
                      {card.title}
                    </h3>
                    {card.href ? (
                      <Link
                        href={card.href}
                        className="mt-1 block text-sm text-text-warm hover:text-cyan transition-colors"
                      >
                        {card.detail}
                      </Link>
                    ) : (
                      <p className="mt-1 text-sm text-text-warm">{card.detail}</p>
                    )}
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
