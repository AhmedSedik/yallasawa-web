"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { locales, localeConfig, type Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === currentLocale) return;
    const segments = pathname.split("/");
    segments[1] = next;
    router.replace(segments.join("/"));
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className="flex items-center gap-1.5 text-sm font-medium text-text-warm transition-colors duration-200 hover:text-cyan"
      >
        <Globe size={16} />
        <span>{localeConfig[currentLocale].label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute end-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-md bg-surface-container shadow-xl ring-1 ring-white/5 backdrop-blur"
        >
          {locales.map((l) => {
            const active = l === currentLocale;
            return (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => switchTo(l)}
                  lang={localeConfig[l].htmlLang}
                  dir={localeConfig[l].dir}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-surface-high text-text-primary"
                      : "text-text-warm hover:bg-surface-high hover:text-text-primary"
                  }`}
                >
                  <span>{localeConfig[l].label}</span>
                  {active && <Check size={14} className="opacity-80" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
