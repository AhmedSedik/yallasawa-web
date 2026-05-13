import type { ReactNode } from "react";
import type { Metadata } from "next";
import { inter, jakartaSans, vietnamPro } from "../fonts";
import { BRAND } from "@/lib/brand";
import "../globals.css";

export const metadata: Metadata = {
  title: `${BRAND.name} Admin`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakartaSans.variable} ${vietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface-base text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
