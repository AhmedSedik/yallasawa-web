"use client";

import { usePathname } from "next/navigation";

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    isLast: i === segments.length - 1,
  }));
}

export default function AdminHeader() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex items-center h-14 px-6 bg-surface-low/50">
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-outline">/</span>}
            <span className={crumb.isLast ? "text-text-primary" : "text-outline"}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
    </header>
  );
}
