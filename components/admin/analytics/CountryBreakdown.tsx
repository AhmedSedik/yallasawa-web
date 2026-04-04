"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import type { CountryData } from "@/lib/analytics-types";
import { countryCodeToFlag, countryName } from "@/lib/analytics-utils";
import SectionCard from "./SectionCard";
import BarChart from "./BarChart";

interface CountryBreakdownProps {
  data: CountryData[];
}

export default function CountryBreakdown({ data }: CountryBreakdownProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? data : data.slice(0, 10);

  return (
    <SectionCard title="Users by Country" icon={Globe}>
      <BarChart
        items={visible.map((c) => ({
          label: countryName(c.code),
          value: c.count,
          prefix: countryCodeToFlag(c.code),
        }))}
        showPercentage
        totalForPercentage={data.reduce((sum, c) => sum + c.count, 0)}
      />
      {data.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-xs text-cta-amber-light hover:text-cta-amber-deep transition-colors"
        >
          {showAll ? "Show less" : `Show all ${data.length} countries`}
        </button>
      )}
    </SectionCard>
  );
}
