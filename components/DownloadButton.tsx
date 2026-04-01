"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { APP_VERSION, DOWNLOAD_URL } from "@/lib/constants";

interface DownloadButtonProps {
  className?: string;
  size?: "default" | "large";
  fullWidth?: boolean;
}

export function DownloadButton({ className = "", size = "default", fullWidth = false }: DownloadButtonProps) {
  const t = useTranslations("hero");
  const sizeClasses = size === "large"
    ? "px-8 py-4 text-lg gap-3"
    : "px-6 py-3 text-sm gap-2";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={DOWNLOAD_URL}
        className={`amber-gradient inline-flex items-center justify-center font-display font-semibold text-surface-base rounded-sm ${sizeClasses} ${fullWidth ? "w-full" : ""} transition-all duration-200 hover:brightness-110 ${className}`}
      >
        <Download className={size === "large" ? "w-5 h-5" : "w-4 h-4"} />
        <span className="flex flex-col items-start leading-tight">
          <span>{t("download")}</span>
          <span className="text-[0.65em] font-normal opacity-70">v{APP_VERSION}</span>
        </span>
      </Link>
    </motion.div>
  );
}
