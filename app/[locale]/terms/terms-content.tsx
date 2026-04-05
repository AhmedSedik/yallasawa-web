"use client";

import { useTranslations } from "next-intl";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";

export default function TermsContent() {
  const lt = useTranslations("legal");
  const t = useTranslations("terms");

  const sections = [
    {
      id: "acceptance",
      title: t("s1_title"),
      content: <p>{t("s1_text")}</p>,
    },
    {
      id: "description",
      title: t("s2_title"),
      content: (
        <>
          <p>{t("s2_text1")}</p>
          <p>{t("s2_text2")}</p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: t("s3_title"),
      content: (
        <>
          <p>{t("s3_intro")}</p>
          <ul>
            <li>{t("s3_item1")}</li>
            <li>{t("s3_item2")}</li>
            <li>{t("s3_item3")}</li>
            <li>{t("s3_item4")}</li>
            <li>{t("s3_item5")}</li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: t("s4_title"),
      content: <p>{t("s4_text")}</p>,
    },
    {
      id: "warranties",
      title: t("s5_title"),
      content: <p>{t("s5_text")}</p>,
    },
    {
      id: "liability",
      title: t("s6_title"),
      content: <p>{t("s6_text")}</p>,
    },
    {
      id: "termination",
      title: t("s7_title"),
      content: <p>{t("s7_text")}</p>,
    },
    {
      id: "contact",
      title: t("s8_title"),
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
