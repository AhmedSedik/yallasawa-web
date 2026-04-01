"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  badge: string;
  title: string;
  lastUpdated: string;
  summary: string;
  sections: Section[];
}

export default function LegalLayout({ badge, title, lastUpdated, summary, sections }: LegalLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan">
              {badge}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-text-primary md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-outline">Last updated: {lastUpdated}</p>
            <p className="mt-2 text-text-warm">{summary}</p>
          </div>
        </ScrollReveal>

        {/* Two-column: TOC + Content */}
        <div className="flex gap-12">
          {/* Sidebar TOC (desktop) */}
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <nav className="sticky top-24 glass glass-border rounded-md p-4 space-y-1">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block rounded-sm px-3 py-2 text-sm transition-colors duration-200 ${
                    activeId === s.id
                      ? "bg-cyan/10 text-cyan font-medium border-l-2 border-cyan"
                      : "text-text-warm hover:text-cyan"
                  }`}
                >
                  {i + 1}. {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-12">
            {sections.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 0.05}>
                <div id={s.id}>
                  <h2 className="font-display text-xl font-semibold text-cyan">
                    {i + 1}. {s.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:text-text-warm [&_strong]:text-text-primary [&_strong]:font-medium">
                    {s.content}
                  </div>
                  {i < sections.length - 1 && (
                    <div className="mt-12 h-px bg-cyan/8" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
