import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/en/:path*",
        headers: [{ key: "Content-Language", value: "en" }],
      },
      {
        source: "/ar/:path*",
        headers: [{ key: "Content-Language", value: "ar" }],
      },
      {
        source: "/de/:path*",
        headers: [{ key: "Content-Language", value: "de" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
