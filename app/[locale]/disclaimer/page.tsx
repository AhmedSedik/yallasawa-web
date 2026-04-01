"use client";

import { useTranslations } from "next-intl";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";

export default function DisclaimerPage() {
  const lt = useTranslations("legal");
  const t = useTranslations("disclaimer");

  const sections = [
    {
      id: "beta-status",
      title: "Beta Software",
      content: (
        <>
          <p>YallaSawa is in <strong>beta</strong>. The software may contain bugs, features may change without notice, and data loss may occur.</p>
          <p>By using the beta, you acknowledge and accept these limitations.</p>
        </>
      ),
    },
    {
      id: "no-warranties",
      title: "No Warranties",
      content: <p>YallaSawa is provided <strong>&quot;AS IS&quot;</strong> without warranties of any kind, express or implied.</p>,
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: <p>To the fullest extent permitted by law, YallaSawa and its developers shall not be liable for any damages arising from use of the App.</p>,
    },
    {
      id: "third-party",
      title: "Third-Party Content",
      content: (
        <>
          <p><strong>YallaSawa does not host, store, distribute, or control any video content.</strong> All videos are streamed from third-party platforms to each user&apos;s device.</p>
          <p>Users are responsible for ensuring they have the right to access content they watch.</p>
        </>
      ),
    },
    {
      id: "drm",
      title: "DRM & Content Licensing",
      content: <p>YallaSawa includes Widevine CDM for compatibility with legitimate streaming platforms. It does not decrypt, copy, redistribute, or circumvent content protection.</p>,
    },
    {
      id: "network",
      title: "Network & Connectivity",
      content: <p>YallaSawa requires internet access. Server uptime, sync accuracy, and compatibility with all networks are not guaranteed.</p>,
    },
    {
      id: "use-at-own-risk",
      title: "Use at Your Own Risk",
      content: (
        <p>Your use of YallaSawa is at your own risk. Questions? Contact <a href={`mailto:${LEGAL_EMAIL}`} className="text-cyan hover:underline">{LEGAL_EMAIL}</a> or <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan hover:underline">{CONTACT_EMAIL}</a>.</p>
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
