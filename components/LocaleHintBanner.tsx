"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { locales, localeConfig, type Locale } from "@/i18n/routing";

const COOKIE_NAME = "ys_locale_hint";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function setHintCookie(value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function hasHintCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

function detectPreferredLocale(current: Locale): Locale | null {
  if (typeof navigator === "undefined") return null;
  const navLangs = [navigator.language, ...(navigator.languages ?? [])];
  for (const tag of navLangs) {
    const primary = tag.toLowerCase().split("-")[0];
    const match = (locales as readonly string[]).find((l) => l === primary);
    if (match && match !== current) return match as Locale;
  }
  return null;
}

export default function LocaleHintBanner({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations("locale_hint");
  const router = useRouter();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    if (hasHintCookie()) return;
    const next = detectPreferredLocale(currentLocale);
    if (next) setSuggested(next);
  }, [currentLocale]);

  if (!suggested) return null;

  const handleSwitch = () => {
    setHintCookie("switched");
    setSuggested(null);
    const segments = pathname.split("/");
    segments[1] = suggested;
    router.replace(segments.join("/"));
  };

  const handleDismiss = () => {
    setHintCookie("dismissed");
    setSuggested(null);
  };

  return (
    <div
      role="region"
      aria-label="Language suggestion"
      className="sticky top-16 z-40 border-b border-white/5 bg-surface-container/80 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-2 text-sm">
        <p
          className="text-text-warm"
          lang={localeConfig[suggested].htmlLang}
          dir={localeConfig[suggested].dir}
        >
          {t("message", { language: localeConfig[suggested].label })}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwitch}
            className="rounded-md bg-primary/20 px-3 py-1 text-xs font-medium text-primary-light transition-colors hover:bg-primary/30"
          >
            {t("switch")}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={t("dismiss")}
            className="text-text-warm transition-colors hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
