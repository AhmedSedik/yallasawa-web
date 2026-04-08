import { AlertTriangle, Users, ShieldCheck, Bug } from "lucide-react";
import StatsCard from "../StatsCard";
import type { CrashSummary } from "@/lib/crash-analytics-types";

interface Props {
  summary: CrashSummary;
}

export default function CrashSummaryStats({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label="Total Crashes"
        value={summary.totalCrashes.toLocaleString()}
        icon={AlertTriangle}
      />
      <StatsCard
        label="Users Affected"
        value={summary.uniqueUsersAffected.toLocaleString()}
        icon={Users}
        accent="cyan"
      />
      <StatsCard
        label="Crash-Free Rate"
        value={`${summary.crashFreeRate}%`}
        icon={ShieldCheck}
      />
      <StatsCard
        label="By Severity"
        value={summary.fatalCount}
        subtext={`${summary.errorCount} errors, ${summary.warningCount} warnings`}
        icon={Bug}
        accent="cyan"
      />
    </div>
  );
}
