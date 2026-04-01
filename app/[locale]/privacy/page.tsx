"use client";

import { useTranslations } from "next-intl";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";

export default function PrivacyPage() {
  const lt = useTranslations("legal");
  const t = useTranslations("privacy");

  const sections = [
    {
      id: "information-collected",
      title: "Information We Collect",
      content: (
        <>
          <p>When you use YallaSawa, we collect limited information necessary to provide the service:</p>
          <ul>
            <li><strong>Display Names</strong> — The name you choose when joining a room.</li>
            <li><strong>Room Codes</strong> — Unique identifiers generated when rooms are created.</li>
            <li><strong>Chat Messages</strong> — Temporarily held in memory for real-time delivery, not permanently stored.</li>
            <li><strong>Connection Data</strong> — IP addresses and WebSocket connection metadata.</li>
            <li><strong>Basic Analytics</strong> — Anonymous usage patterns such as room creation frequency.</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How We Use Your Data",
      content: (
        <>
          <p>We use collected information solely to operate and improve YallaSawa:</p>
          <ul>
            <li><strong>Real-time synchronization</strong> — Coordinating video playback state.</li>
            <li><strong>Room management</strong> — Creating, joining, and managing rooms.</li>
            <li><strong>Chat delivery</strong> — Routing messages in real time.</li>
            <li><strong>Latency compensation</strong> — Measuring network latency for sync.</li>
          </ul>
          <p>We do not sell, rent, or share your data with third parties for advertising.</p>
        </>
      ),
    },
    {
      id: "data-storage",
      title: "Data Storage & Retention",
      content: (
        <>
          <p>YallaSawa minimizes data retention:</p>
          <ul>
            <li><strong>Chat messages</strong> — held in memory only during active sessions.</li>
            <li><strong>Room data</strong> — cleaned up on room closure.</li>
            <li><strong>Connection logs</strong> — retained up to 30 days for debugging.</li>
          </ul>
          <p>Server infrastructure is hosted on <strong>Railway</strong> (railway.app).</p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      content: (
        <ul>
          <li><strong>Firebase</strong> (Google) — Authentication.</li>
          <li><strong>Railway</strong> — Server hosting.</li>
          <li><strong>Widevine CDM</strong> (Google) — DRM module, operates locally.</li>
          <li><strong>Metered.ca</strong> — TURN server for WebRTC voice chat.</li>
        </ul>
      ),
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: (
        <>
          <p>You have the right to: access, deletion, correction, and portability of your data.</p>
          <p>Contact us at <a href={`mailto:${LEGAL_EMAIL}`} className="text-cyan hover:underline">{LEGAL_EMAIL}</a>.</p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: (
        <p>YallaSawa is not intended for children under 13. Contact <a href={`mailto:${LEGAL_EMAIL}`} className="text-cyan hover:underline">{LEGAL_EMAIL}</a> if you believe a child has provided personal data.</p>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      content: (
        <ul>
          <li><strong>General:</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan hover:underline">{CONTACT_EMAIL}</a></li>
          <li><strong>Legal:</strong> <a href={`mailto:${LEGAL_EMAIL}`} className="text-cyan hover:underline">{LEGAL_EMAIL}</a></li>
        </ul>
      ),
    },
  ];

  return (
    <LegalLayout
      badge={lt("badge")}
      title={t("title")}
      lastUpdated={lt("last_updated")}
      summary={t("summary")}
      sections={sections}
    />
  );
}
