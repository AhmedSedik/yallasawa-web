"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQAccordion({ categories }: { categories: FAQCategory[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category.title}>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan">
              {category.title}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
          </div>
          <div className="space-y-3">
            {category.items.map((item) => {
              const key = `${category.title}-${item.question}`;
              const isOpen = openIndex === key;
              return (
                <motion.div
                  key={key}
                  className={`group rounded-xl transition-all duration-300 ${
                    isOpen
                      ? "bg-surface-container glass-border shadow-lg shadow-cyan/5"
                      : "bg-surface-low/50 hover:bg-surface-container/60"
                  }`}
                  layout
                >
                  <button
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between px-6 py-5 text-start"
                  >
                    <span className={`font-display text-base font-medium transition-colors duration-200 pe-4 ${
                      isOpen ? "text-cyan" : "text-text-primary group-hover:text-cyan/80"
                    }`}>
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={`flex-shrink-0 rounded-full p-1 transition-colors duration-200 ${
                        isOpen ? "bg-cyan/10" : "bg-surface-high/50"
                      }`}
                    >
                      <ChevronDown className={`h-4 w-4 transition-colors duration-200 ${
                        isOpen ? "text-cyan" : "text-text-warm"
                      }`} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <div className="h-px bg-gradient-to-r from-cyan/10 via-cyan/5 to-transparent mb-4" />
                          <p className="text-base leading-relaxed text-text-warm">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
