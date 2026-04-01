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
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category.title}>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-cyan">
            {category.title}
          </h3>
          <div className="space-y-2">
            {category.items.map((item) => {
              const key = `${category.title}-${item.question}`;
              const isOpen = openIndex === key;
              return (
                <div
                  key={key}
                  className={`glass glass-border rounded-md transition-colors duration-200 ${isOpen ? "bg-surface-high/30" : ""}`}
                >
                  <button
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-display text-sm font-medium text-text-primary pr-4">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-cyan" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-cyan/10 px-6 py-4">
                          <p className="text-sm leading-relaxed text-text-warm">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
