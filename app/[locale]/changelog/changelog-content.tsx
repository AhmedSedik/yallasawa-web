"use client";

import { useTranslations, useLocale } from "next-intl";
import { Plus, RefreshCw, Wrench } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

interface ChangelogSection {
  type: "Added" | "Changed" | "Fixed";
  items: string[];
}

interface ChangelogEntry {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

interface ChangelogContentProps {
  entries: ChangelogEntry[];
}

const sectionConfig: Record<
  string,
  { color: string; bg: string; icon: typeof Plus }
> = {
  Added: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Plus },
  Changed: { color: "text-blue-400", bg: "bg-blue-400/10", icon: RefreshCw },
  Fixed: { color: "text-red-400", bg: "bg-red-400/10", icon: Wrench },
};

function parseItem(raw: string) {
  const boldMatch = raw.match(/^\*\*(.+?)\*\*\s*—?\s*(.*)/);
  if (boldMatch) {
    return { name: boldMatch[1], description: boldMatch[2] || "" };
  }
  return { name: "", description: raw };
}

function formatDate(dateStr: string, locale: string) {
  try {
    return new Date(dateStr).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch {
    return dateStr;
  }
}

export default function ChangelogContent({ entries }: ChangelogContentProps) {
  const t = useTranslations("changelog");
  const locale = useLocale();

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
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

        {/* Changelog entries */}
        {entries.length > 0 ? (
          <div className="relative mt-20">
            {/* Timeline line */}
            <div className="absolute start-[19px] top-2 bottom-0 w-px bg-surface-high md:start-[23px]" />

            <div className="space-y-12">
              {entries.map((entry, idx) => (
                <ScrollReveal key={entry.version} delay={idx * 0.05}>
                  <div className="relative ps-12 md:ps-14">
                    {/* Timeline dot */}
                    <div className="absolute start-2.5 top-1.5 h-3 w-3 rounded-full bg-cyan md:start-3.5 md:h-4 md:w-4" />

                    {/* Version header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-block rounded-md bg-cyan/15 px-3 py-1 font-display text-sm font-bold text-cyan">
                        v{entry.version}
                      </span>
                      <span className="text-sm text-text-warm">
                        {formatDate(entry.date, locale)}
                      </span>
                    </div>

                    {/* Sections */}
                    <div className="mt-4 space-y-4">
                      {entry.sections.map((section) => {
                        const config = sectionConfig[section.type] || {
                          color: "text-text-warm",
                          bg: "bg-surface-high",
                          icon: Plus,
                        };
                        const Icon = config.icon;

                        return (
                          <div key={section.type}>
                            {/* Section label */}
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-md ${config.bg} px-2.5 py-1 text-xs font-semibold ${config.color}`}
                              >
                                <Icon size={12} />
                                {section.type}
                              </span>
                            </div>

                            {/* Items */}
                            <ul className="mt-2 space-y-1.5 ps-1">
                              {section.items.map((item, i) => {
                                const parsed = parseItem(item);
                                return (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-surface-highest" />
                                    <span className="text-text-warm">
                                      {parsed.name && (
                                        <span className="font-semibold text-text-primary">
                                          {parsed.name}
                                        </span>
                                      )}
                                      {parsed.name && parsed.description && (
                                        <span className="text-outline mx-1">
                                          —
                                        </span>
                                      )}
                                      {parsed.description}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-20 text-center">
            <p className="text-text-warm">{t("empty")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
