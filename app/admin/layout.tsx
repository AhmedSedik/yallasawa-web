import type { ReactNode } from "react";
import type { Metadata } from "next";
import { jakartaSans, vietnamPro } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "YallaSawa Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${vietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface-base text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
