"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useRelease } from "@/lib/ReleaseContext";

export default function Footer() {
  const t = useTranslations("footer");
  const nt = useTranslations("nav");
  const { downloadUrl } = useRelease();

  const navLinks = [
    { label: nt("about"), href: "/about" },
    { label: nt("faq"), href: "/faq" },
    { label: nt("changelog"), href: "/changelog" },
    { label: nt("contact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
    { label: t("disclaimer"), href: "/disclaimer" },
  ];

  return (
    <footer className="bg-surface-low">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top: 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/app-icon.png"
                alt="YallaSawa"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="font-display text-lg font-bold text-text-primary">
                yalla<span className="text-cyan">sawa</span>
              </span>
            </div>
            <p className="text-text-warm text-sm mt-4">
              {t("tagline")}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-text-primary font-display font-semibold text-sm uppercase tracking-wider mb-4">
              {t("product")}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-warm text-sm hover:text-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <h3 className="text-text-primary font-display font-semibold text-sm uppercase tracking-wider mb-4">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-warm text-sm hover:text-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-text-primary font-display font-semibold text-sm uppercase tracking-wider mb-4">
              {t("get_in_touch")}
            </h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-text-warm text-sm hover:text-cyan transition-colors duration-200"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="mt-4">
              <Link
                href={downloadUrl}
                className="inline-block text-sm font-display font-semibold amber-gradient text-surface-base px-4 py-2 rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity duration-200"
              >
                {t("download_app")}
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-surface-high mt-12 mb-8" />

        {/* Bottom: copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-warm text-sm">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
