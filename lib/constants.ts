import { BRAND } from "@/lib/brand";

// Site URL
export const SITE_URL = BRAND.siteUrl;

// Navigation links
export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

// Legal links (footer)
export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
] as const;

// Contact
export const CONTACT_EMAIL = BRAND.contactEmail;
export const INFO_EMAIL = BRAND.infoEmail;
export const LEGAL_EMAIL = BRAND.legalEmail;

// Social links
export const SOCIAL_LINKS = {
  github: "#", // TODO: Add GitHub URL
  twitter: "#", // TODO: Add Twitter/X URL
  discord: "#", // TODO: Add Discord URL
} as const;
