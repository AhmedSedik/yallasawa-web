"use client";

import { UserPlus } from "lucide-react";
import type { TimeSeriesPoint } from "@/lib/analytics-types";
import SectionCard from "./SectionCard";
import TimeSeriesChart from "./TimeSeriesChart";

interface UserGrowthChartProps {
  data: TimeSeriesPoint[];
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <SectionCard title="User Registrations" icon={UserPlus}>
      <p className="text-xs text-outline mb-3">
        {total.toLocaleString()} new {total === 1 ? "user" : "users"} in this period
      </p>
      <TimeSeriesChart data={data} color="amber" />
    </SectionCard>
  );
}
