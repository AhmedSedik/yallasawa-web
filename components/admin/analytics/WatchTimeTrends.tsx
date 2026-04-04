"use client";

import { Clock } from "lucide-react";
import type { TimeSeriesPoint } from "@/lib/analytics-types";
import { formatHours } from "@/lib/analytics-utils";
import SectionCard from "./SectionCard";
import TimeSeriesChart from "./TimeSeriesChart";

interface WatchTimeTrendsProps {
  data: TimeSeriesPoint[];
}

export default function WatchTimeTrends({ data }: WatchTimeTrendsProps) {
  const totalMs = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <SectionCard title="Watch Time" icon={Clock}>
      <p className="text-xs text-outline mb-3">
        {formatHours(totalMs)} total in this period
      </p>
      <TimeSeriesChart data={data} color="cyan" formatValue={formatHours} />
    </SectionCard>
  );
}
