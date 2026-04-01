"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { DownloadButton } from "./DownloadButton";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* Ambient cyan glow — background radial */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[400px] md:h-[600px] md:w-[800px] rounded-full bg-cyan/8 blur-[150px]" />

      {/* Headline */}
      <motion.h1
        className="relative z-10 max-w-4xl text-center font-display text-5xl font-extrabold leading-tight tracking-tight text-text-primary md:text-7xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {t("headline")}{" "}
        <span className="amber-gradient-text">{t("headline_accent")}</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="relative z-10 mt-6 max-w-2xl text-center text-lg text-text-warm md:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        {t("subheading")}
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="relative z-10 mt-10 flex flex-col items-center gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <DownloadButton size="large" />
        <Link
          href="#features"
          className="inline-flex items-center gap-2 rounded-sm border border-glass-border px-8 py-4 font-display text-lg font-semibold text-cyan transition-colors duration-200 hover:border-glass-border-hover hover:bg-glass"
        >
          {t("learn_more")}
        </Link>
      </motion.div>

      {/* App showcase — cinematic floating composition */}
      <motion.div
        className="relative z-10 mt-16 w-full max-w-4xl"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
      >
        <div className="hero-showcase relative overflow-hidden rounded-2xl glass glass-border">
          {/* Ambient golden glow behind icon */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px] md:h-[400px] md:w-[400px] rounded-full bg-amber-deep/15 blur-[100px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] h-[120px] w-[120px] md:h-[200px] md:w-[200px] rounded-full bg-amber-light/10 blur-[60px]" />

          {/* Orbiting ring effect */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] md:h-[320px] md:w-[320px] rounded-full border border-amber-deep/15 hero-orbit" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] md:h-[420px] md:w-[420px] rounded-full border border-cyan/8 hero-orbit-reverse" />

          {/* Star particles */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[15%] left-[10%] h-1 w-1 rounded-full bg-amber-light/60 hero-twinkle" />
            <div className="absolute top-[25%] left-[85%] h-1.5 w-1.5 rounded-full bg-cyan/40 hero-twinkle" style={{ animationDelay: "1.2s" }} />
            <div className="absolute top-[70%] left-[15%] h-1 w-1 rounded-full bg-amber-light/40 hero-twinkle" style={{ animationDelay: "0.6s" }} />
            <div className="absolute top-[80%] left-[80%] h-1 w-1 rounded-full bg-cyan/50 hero-twinkle" style={{ animationDelay: "2s" }} />
            <div className="absolute top-[10%] left-[50%] h-0.5 w-0.5 rounded-full bg-white/30 hero-twinkle" style={{ animationDelay: "0.3s" }} />
            <div className="absolute top-[60%] left-[90%] h-0.5 w-0.5 rounded-full bg-amber-light/50 hero-twinkle" style={{ animationDelay: "1.8s" }} />
            <div className="absolute top-[40%] left-[5%] h-1 w-1 rounded-full bg-white/20 hero-twinkle" style={{ animationDelay: "0.9s" }} />
            <div className="absolute top-[90%] left-[45%] h-0.5 w-0.5 rounded-full bg-cyan/30 hero-twinkle" style={{ animationDelay: "1.5s" }} />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-8 py-16 md:flex-row md:justify-center md:gap-16 md:px-16 md:py-20">
            {/* App icon with glow ring */}
            <motion.div
              className="relative flex-shrink-0"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-[-12px] rounded-[2rem] bg-gradient-to-b from-amber-deep/30 via-amber-light/10 to-transparent blur-xl" />
              <Image
                src="/images/app-icon.png"
                alt="YallaSawa"
                width={220}
                height={220}
                className="relative w-[140px] h-[140px] md:w-[220px] md:h-[220px] rounded-[1.5rem] shadow-2xl shadow-amber-deep/20"
                priority
              />
            </motion.div>

            {/* Text content */}
            <div className="text-center md:text-start">
              <h2 className="font-display text-5xl font-extrabold text-text-primary md:text-6xl">
                yalla<span className="text-cyan">sawa</span>
              </h2>
              <p className="mt-3 font-display text-xl font-medium text-cyan/80">
                watch together
              </p>
              <p className="mt-2 text-sm tracking-[0.2em] text-text-warm/60">
                shahid &middot; watch it &middot; &amp; more
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
