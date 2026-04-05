"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import FAQAccordion from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function FAQContent() {
  const t = useTranslations("faq");

  const faqCategories = [
    {
      title: t("getting_started"),
      items: [
        { question: t("q_what_is"), answer: t("a_what_is") },
        { question: t("q_install"), answer: t("a_install") },
        { question: t("q_platforms"), answer: t("a_platforms") },
        { question: t("q_free"), answer: t("a_free") },
      ],
    },
    {
      title: t("using_app"),
      items: [
        { question: t("q_create_party"), answer: t("a_create_party") },
        { question: t("q_sync"), answer: t("a_sync") },
        { question: t("q_any_video"), answer: t("a_any_video") },
        { question: t("q_queue"), answer: t("a_queue") },
      ],
    },
    {
      title: t("technical"),
      items: [
        { question: t("q_drm"), answer: t("a_drm") },
        { question: t("q_latency"), answer: t("a_latency") },
        { question: t("q_secure"), answer: t("a_secure") },
      ],
    },
    {
      title: t("legal"),
      items: [
        { question: t("q_legal"), answer: t("a_legal") },
        { question: t("q_host_content"), answer: t("a_host_content") },
        { question: t("q_data_collect"), answer: t("a_data_collect") },
      ],
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
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

        <FAQAccordion categories={faqCategories} />

        <ScrollReveal>
          <div className="mt-16 text-center">
            <h3 className="font-display text-xl font-semibold text-text-primary">
              {t("still_questions")}
            </h3>
            <p className="mt-2 text-text-warm">{t("here_to_help")}</p>
            <Link
              href="/contact"
              className="mt-6 inline-block amber-gradient rounded-sm px-8 py-3 font-display font-semibold text-surface-base transition-opacity hover:opacity-90"
            >
              {t("contact_us")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
