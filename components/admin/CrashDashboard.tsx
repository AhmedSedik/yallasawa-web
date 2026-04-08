"use client";

import { useState, useEffect } from "react";
import type { CrashAnalyticsResponse } from "@/lib/crash-analytics-types";
import CrashSummaryStats from "./crashes/CrashSummaryStats";
import CrashTrendChart from "./crashes/CrashTrendChart";
import TopErrorsList from "./crashes/TopErrorsList";
import VersionOsBreakdown from "./crashes/VersionOsBreakdown";
import PerformanceOverview from "./crashes/PerformanceOverview";
import RecentCrashesList from "./crashes/RecentCrashesList";

type TimeRange = "7d" | "30d" | "90d";

const rangeLabels: Record<TimeRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

export default function CrashDashboard() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [data, setData] = useState<CrashAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/crashes?range=${range}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load crash data");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [range]);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["7d", "30d", "90d"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              range === r
                ? "bg-cta-amber-deep/10 text-cta-amber-light"
                : "text-outline hover:bg-surface-container hover:text-text-primary"
            }`}
          >
            {rangeLabels[r]}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass glass-border rounded-lg p-5 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="glass glass-border rounded-lg p-5 h-48 animate-pulse"
            />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Summary
            </h2>
            <CrashSummaryStats summary={data.summary} />
          </section>

          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Crash Trend
            </h2>
            <CrashTrendChart data={data.crashTrend} />
          </section>

          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Top Errors
            </h2>
            <TopErrorsList errors={data.topErrors} />
          </section>

          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Versions & Platforms
            </h2>
            <VersionOsBreakdown
              versions={data.versionBreakdown}
              oses={data.osBreakdown}
            />
          </section>

          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Performance
            </h2>
            <PerformanceOverview data={data.performance} />
          </section>

          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Recent Crashes
            </h2>
            <RecentCrashesList crashes={data.recentCrashes} />
          </section>

          <p className="text-xs text-outline/50 text-right">
            Data cached at{" "}
            {new Date(data.generatedAt).toLocaleTimeString()}
          </p>
        </div>
      ) : null}
    </div>
  );
}
