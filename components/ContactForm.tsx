"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const subjects = [
    t("subject_general"),
    t("subject_bug"),
    t("subject_feature"),
    t("subject_legal"),
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="glass glass-border rounded-lg p-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="font-display text-xl font-semibold text-cyan">
          {t("form_success_title")}
        </h3>
        <p className="mt-2 text-text-warm">
          {t("form_success_desc")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass glass-border rounded-lg p-8 space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-warm mb-1.5">
          {t("form_name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-sm bg-surface-low border border-glass-border px-4 py-3 text-sm text-text-primary placeholder:text-outline focus:border-cyan/40 focus:outline-none transition-colors"
          placeholder={t("form_placeholder_name")}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-warm mb-1.5">
          {t("form_email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          className="w-full rounded-sm bg-surface-low border border-glass-border px-4 py-3 text-sm text-text-primary placeholder:text-outline focus:border-cyan/40 focus:outline-none transition-colors"
          placeholder={t("form_placeholder_email")}
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text-warm mb-1.5">
          {t("form_subject")}
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-sm bg-surface-low border border-glass-border px-4 py-3 text-sm text-text-primary focus:border-cyan/40 focus:outline-none transition-colors appearance-none"
        >
          <option value="">{t("form_placeholder_subject")}</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-warm mb-1.5">
          {t("form_message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          dir="auto"
          className="w-full rounded-sm bg-surface-low border border-glass-border px-4 py-3 text-sm text-text-primary placeholder:text-outline focus:border-cyan/40 focus:outline-none transition-colors resize-none"
          placeholder={t("form_placeholder_message")}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <motion.button
        type="submit"
        disabled={sending}
        className="amber-gradient flex w-full items-center justify-center gap-2 rounded-sm py-3.5 font-display font-semibold text-surface-base transition-all duration-200 hover:brightness-110 disabled:opacity-50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send className="h-4 w-4" />
        {sending ? "Sending..." : t("form_submit")}
      </motion.button>
    </form>
  );
}
