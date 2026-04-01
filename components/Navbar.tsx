"use client";

import { motion } from "framer-motion";
import { Download, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useRelease } from "@/lib/ReleaseContext";

import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const { downloadUrl } = useRelease();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: t("about"), href: "/about" },
    { label: t("faq"), href: "/faq" },
    { label: t("contact"), href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          scrolled
            ? "bg-surface-base/85 backdrop-blur-xl"
            : "glass"
        } glass-border`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image
              src="/images/app-icon.png"
              alt="YallaSawa"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg"
              priority
            />
            <span className="font-display text-lg font-bold text-text-primary">
              yalla<span className="text-cyan">sawa</span>
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-warm transition-colors duration-200 hover:text-cyan"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop: lang switcher + CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />
            <Link
              href={downloadUrl}
              className="amber-gradient flex items-center gap-2 rounded-sm px-5 py-2 font-display text-sm font-semibold text-surface-base transition-opacity duration-200 hover:opacity-90"
            >
              <Download size={16} />
              {t("download")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="text-text-primary transition-colors duration-200 hover:text-cyan md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
