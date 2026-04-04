"use client";

import { ShieldCheck, UserCheck, Activity } from "lucide-react";
import type { EngagementData } from "@/lib/analytics-types";
import StatsCard from "../StatsCard";
import SectionCard from "./SectionCard";

interface EngagementMetricsProps {
  data: EngagementData;
}

export default function EngagementMetrics({ data }: EngagementMetricsProps) {
  const googlePct =
    data.totalUsers > 0 ? Math.round((data.googleAuthCount / data.totalUsers) * 100) : 0;
  const active30Pct =
    data.totalUsers > 0 ? Math.round((data.activeUsers30d / data.totalUsers) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Active Users (7d)"
          value={data.activeUsers7d}
          subtext={`of ${data.totalUsers} total`}
          icon={Activity}
        />
        <StatsCard
          label="Active Users (30d)"
          value={data.activeUsers30d}
          subtext={`${active30Pct}% of total`}
          icon={Activity}
          accent="cyan"
        />
        <StatsCard
          label="Verification Rate"
          value={`${data.verificationRate}%`}
          icon={UserCheck}
        />
      </div>

      <SectionCard title="Authentication Methods" icon={ShieldCheck}>
        {data.totalUsers === 0 ? (
          <p className="text-sm text-outline py-4 text-center">No users yet</p>
        ) : (
          <div>
            {/* Split bar */}
            <div className="h-8 rounded-md overflow-hidden flex">
              <div
                className="bg-cta-amber-deep/50 transition-all duration-500"
                style={{ width: `${googlePct}%` }}
              />
              <div
                className="bg-cyan/40 transition-all duration-500"
                style={{ width: `${100 - googlePct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-cta-amber-light">
                Google: {data.googleAuthCount} ({googlePct}%)
              </span>
              <span className="text-cyan">
                Email: {data.emailOnlyCount} ({100 - googlePct}%)
              </span>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
