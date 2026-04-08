"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageViewTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    // Skip admin pages
    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();

    fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        locale,
        referrer: document.referrer || undefined,
      }),
      signal: controller.signal,
    }).catch(() => {
      // Silently fail — page view tracking is non-critical
    });

    return () => controller.abort();
  }, [pathname, locale]);

  return null;
}
