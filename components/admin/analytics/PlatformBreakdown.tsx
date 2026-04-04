"use client";

import { Tv } from "lucide-react";
import type { PlatformData } from "@/lib/analytics-types";
import SectionCard from "./SectionCard";
import BarChart from "./BarChart";

interface PlatformBreakdownProps {
  data: PlatformData[];
  indexRequired?: boolean;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PlatformBreakdown({ data, indexRequired }: PlatformBreakdownProps) {
  return (
    <SectionCard title="Platforms Watched" icon={Tv}>
      {indexRequired ? (
        <div className="py-4 text-center">
          <p className="text-sm text-outline">Platform data requires a Firestore index.</p>
          <p className="text-xs text-outline/60 mt-1">
            Create a collection group index on watchHistory.watchedAt
          </p>
        </div>
      ) : (
        <BarChart
          items={data.map((p) => ({
            label: capitalize(p.platform),
            value: p.count,
            color: "cyan",
          }))}
          showPercentage
          totalForPercentage={data.reduce((sum, p) => sum + p.count, 0)}
        />
      )}
    </SectionCard>
  );
}
