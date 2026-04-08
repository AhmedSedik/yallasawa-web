import { TrendingUp } from "lucide-react";
import SectionCard from "../analytics/SectionCard";
import TimeSeriesChart from "../analytics/TimeSeriesChart";
import type { TimeSeriesPoint } from "@/lib/analytics-types";

interface Props {
  data: TimeSeriesPoint[];
}

export default function CrashTrendChart({ data }: Props) {
  return (
    <SectionCard title="Crashes Over Time" icon={TrendingUp}>
      <TimeSeriesChart data={data} color="amber" />
    </SectionCard>
  );
}
