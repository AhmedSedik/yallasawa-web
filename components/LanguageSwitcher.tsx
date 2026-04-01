"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    // Remove current locale prefix and add new one
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.replace(segments.join("/"));
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1.5 text-sm font-medium text-text-warm transition-colors duration-200 hover:text-cyan"
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <Globe size={16} />
      <span>{locale === "en" ? "عربي" : "EN"}</span>
    </button>
  );
}
