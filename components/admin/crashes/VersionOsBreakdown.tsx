import { Tag, Monitor } from "lucide-react";
import SectionCard from "../analytics/SectionCard";
import BarChart from "../analytics/BarChart";
import type {
  VersionBreakdown,
  OsBreakdown,
} from "@/lib/crash-analytics-types";

interface Props {
  versions: VersionBreakdown[];
  oses: OsBreakdown[];
}

const osLabels: Record<string, string> = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux",
};

export default function VersionOsBreakdown({ versions, oses }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SectionCard title="By Version" icon={Tag}>
        <BarChart
          items={versions.map((v) => ({
            label: v.version,
            value: v.count,
          }))}
          showPercentage
          totalForPercentage={versions.reduce((s, v) => s + v.count, 0)}
        />
      </SectionCard>

      <SectionCard title="By Platform" icon={Monitor}>
        <BarChart
          items={oses.map((o) => ({
            label: osLabels[o.os] || o.os,
            value: o.count,
            color: "cyan" as const,
          }))}
          showPercentage
          totalForPercentage={oses.reduce((s, o) => s + o.count, 0)}
        />
      </SectionCard>
    </div>
  );
}
