"use client";

import { useTranslations } from "next-intl";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";

export default function PrivacyContent() {
  const lt = useTranslations("legal");
  const t = useTranslations("privacy");

  const sections = [
    {
      id: "information-collected",
      title: t("s1_title"),
      content: (
        <>
          <p>{t("s1_intro")}</p>
          <ul>
            <li><strong>Display Names</strong> — {t("s1_display_names")}</li>
            <li><strong>Room Codes</strong> — {t("s1_room_codes")}</li>
            <li><strong>Chat Messages</strong> — {t("s1_chat_messages")}</li>
            <li><strong>Connection Data</strong> — {t("s1_connection_data")}</li>
            <li><strong>Basic Analytics</strong> — {t("s1_analytics")}</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: t("s2_title"),
      content: (
        <>
          <p>{t("s2_intro")}</p>
          <ul>
            <li><strong>Real-time synchronization</strong> — {t("s2_sync")}</li>
            <li><strong>Room management</strong> — {t("s2_rooms")}</li>
            <li><strong>Chat delivery</strong> — {t("s2_chat")}</li>
            <li><strong>Latency compensation</strong> — {t("s2_latency")}</li>
          </ul>
          <p>{t("s2_no_sell")}</p>
        </>
      ),
    },
    {
      id: "data-storage",
      title: t("s3_title"),
      content: (
        <>
          <p>{t("s3_intro")}</p>
          <ul>
            <li><strong>Chat messages</strong> — {t("s3_chat")}</li>
            <li><strong>Room data</strong> — {t("s3_room")}</li>
            <li><strong>Connection logs</strong> — {t("s3_logs")}</li>
          </ul>
          <p>{t("s3_hosting")}</p>
        </>
      ),
    },
    {
      id: "third-party",
      title: t("s4_title"),
      content: (
        <ul>
          <li><strong>Firebase</strong> (Google) — {t("s4_firebase")}</li>
          <li><strong>Railway</strong> — {t("s4_railway")}</li>
          <li><strong>Widevine CDM</strong> (Google) — {t("s4_widevine")}</li>
          <li><strong>Metered.ca</strong> — {t("s4_metered")}</li>
        </ul>
      ),
    },
    {
      id: "your-rights",
      title: t("s5_title"),
      content: (
        <>
          <p>{t("s5_text")}</p>
          <p>{t("s5_contact")} <a href={`mailto:${LEGAL_EMAIL}`} className="text-cyan hover:underline">{LEGAL_EMAIL}</a>.</p>
        </>
      ),
    },
    {
      id: "children",
      title: t("s6_title"),
      content: (
        <p>{t("s6_text", { email: LEGAL_EMAIL })}</p>
      ),
    },
    {
      id: "contact",
      title: t("s7_title"),
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
