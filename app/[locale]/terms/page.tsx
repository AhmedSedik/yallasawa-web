"use client";

import { useTranslations } from "next-intl";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, LEGAL_EMAIL } from "@/lib/constants";

export default function TermsPage() {
  const lt = useTranslations("legal");
  const t = useTranslations("terms");

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: <p>By downloading, installing, or using YallaSawa, you agree to these Terms of Service. If you do not agree, do not use the App.</p>,
    },
    {
      id: "description",
      title: "Description of Service",
      content: (
        <>
          <p>YallaSawa is a <strong>beta</strong> desktop application for synchronized video watching. Features include real-time playback sync, room-based parties, built-in chat, video queue, and voice chat.</p>
          <p>As beta software, features may change or be removed without notice.</p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      content: (
        <>
          <p>You agree <strong>not</strong> to:</p>
          <ul>
            <li>Share pirated or illegally obtained content</li>
            <li>Circumvent DRM or copy protection</li>
            <li>Harass or abuse other users</li>
            <li>Share illegal or harmful content in chat</li>
            <li>Attempt to disrupt server infrastructure</li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      content: <p><strong>YallaSawa does not host, store, or distribute any video content.</strong> It is a synchronization tool that coordinates playback timing between users accessing content through their own accounts.</p>,
    },
    {
      id: "warranties",
      title: "Disclaimer of Warranties",
      content: <p>YallaSawa is provided <strong>&quot;AS IS&quot;</strong> without warranties of any kind. As beta software, it may contain bugs and incomplete features.</p>,
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: <p>To the maximum extent permitted by law, YallaSawa shall not be liable for any indirect, incidental, special, or consequential damages.</p>,
    },
    {
      id: "termination",
      title: "Termination",
      content: <p>We may suspend or terminate your access at any time. You may stop using the App by uninstalling it.</p>,
    },
    {
      id: "contact",
      title: "Contact Information",
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
