"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useRelease } from "@/lib/ReleaseContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const ft = useTranslations("footer");
  const { downloadUrl } = useRelease();

  const navLinks = [
    { label: t("about"), href: "/about" },
    { label: t("faq"), href: "/faq" },
    { label: t("changelog"), href: "/changelog" },
    { label: t("contact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: ft("privacy"), href: "/privacy" },
    { label: ft("terms"), href: "/terms" },
    { label: ft("disclaimer"), href: "/disclaimer" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Menu panel */}
          <motion.div
            className="fixed end-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-surface-container backdrop-blur-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Close button + lang switcher */}
            <div className="flex h-16 items-center justify-between px-6">
              <LanguageSwitcher />
              <button
                onClick={onClose}
                className="text-text-primary transition-colors duration-200 hover:text-cyan"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav links */}
            <motion.nav
              className="flex flex-col px-6 py-2"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-3 font-display text-lg font-medium text-text-primary transition-colors duration-200 hover:text-cyan"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Divider */}
            <div className="mx-6 my-2 h-px bg-surface-high" />

            {/* Legal links */}
            <motion.nav
              className="flex flex-col px-6 py-2"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05, delayChildren: 0.25 }}
            >
              {legalLinks.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-2 text-sm text-text-warm transition-colors duration-200 hover:text-cyan"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Download button */}
            <div className="mt-auto px-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href={downloadUrl}
                  onClick={onClose}
                  className="amber-gradient flex w-full items-center justify-center gap-2 rounded-sm py-3 font-display font-semibold text-surface-base transition-opacity duration-200 hover:opacity-90"
                >
                  <Download size={18} />
                  {t("download")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
