import { Zap, HardDrive, Wifi, Clock, Activity } from "lucide-react";
import StatsCard from "../StatsCard";
import SectionCard from "../analytics/SectionCard";
import BarChart from "../analytics/BarChart";
import type { PerformanceSummary } from "@/lib/crash-analytics-types";

interface Props {
  data: PerformanceSummary;
}

export default function PerformanceOverview({ data }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Avg Startup"
          value={data.avgStartupTime > 0 ? `${(data.avgStartupTime / 1000).toFixed(1)}s` : "—"}
          icon={Zap}
        />
        <StatsCard
          label="Avg Memory"
          value={data.avgMemoryUsage > 0 ? `${data.avgMemoryUsage} MB` : "—"}
          icon={HardDrive}
          accent="cyan"
        />
        <StatsCard
          label="Avg Sync Latency"
          value={data.avgSyncLatency > 0 ? `${data.avgSyncLatency}ms` : "—"}
          icon={Wifi}
        />
        <StatsCard
          label="P95 Latency"
          value={data.p95SyncLatency > 0 ? `${data.p95SyncLatency}ms` : "—"}
          icon={Clock}
          accent="cyan"
        />
        <StatsCard
          label="Avg API Time"
          value={data.avgApiResponseTime > 0 ? `${data.avgApiResponseTime}ms` : "—"}
          icon={Activity}
        />
      </div>

      <SectionCard title="Sync Latency Distribution" icon={Wifi}>
        <BarChart
          items={data.syncLatencyDistribution.map((b) => ({
            label: b.bucket,
            value: b.count,
            color: "cyan" as const,
          }))}
        />
      </SectionCard>
    </div>
  );
}
