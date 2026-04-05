"use client";

import { useTranslations } from "next-intl";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";

export default function DisclaimerContent() {
  const lt = useTranslations("legal");
  const t = useTranslations("disclaimer");

  const sections = [
    {
      id: "beta-status",
      title: t("s1_title"),
      content: (
        <>
          <p>{t("s1_text1")}</p>
          <p>{t("s1_text2")}</p>
        </>
      ),
    },
    {
      id: "no-warranties",
      title: t("s2_title"),
      content: <p>{t("s2_text")}</p>,
    },
    {
      id: "liability",
      title: t("s3_title"),
      content: <p>{t("s3_text")}</p>,
    },
    {
      id: "third-party",
      title: t("s4_title"),
      content: (
        <>
          <p>{t("s4_text1")}</p>
          <p>{t("s4_text2")}</p>
        </>
      ),
    },
    {
      id: "drm",
      title: t("s5_title"),
      content: <p>{t("s5_text")}</p>,
    },
    {
      id: "network",
      title: t("s6_title"),
      content: <p>{t("s6_text")}</p>,
    },
    {
      id: "use-at-own-risk",
      title: t("s7_title"),
      content: (
        <p>{t("s7_text", { legalEmail: LEGAL_EMAIL, supportEmail: CONTACT_EMAIL })}</p>
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
