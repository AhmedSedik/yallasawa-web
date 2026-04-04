"use client";

import { useState, useEffect } from "react";
import type { AnalyticsResponse } from "@/lib/analytics-types";
import CountryBreakdown from "./analytics/CountryBreakdown";
import UserGrowthChart from "./analytics/UserGrowthChart";
import WatchTimeTrends from "./analytics/WatchTimeTrends";
import PlatformBreakdown from "./analytics/PlatformBreakdown";
import RoomAnalytics from "./analytics/RoomAnalytics";
import EngagementMetrics from "./analytics/EngagementMetrics";

type TimeRange = "30d" | "90d" | "all";

const rangeLabels: Record<TimeRange, string> = {
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  all: "All Time",
};

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load analytics");
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
      {/* Range selector */}
      <div className="flex gap-2 mb-6">
        {(["30d", "90d", "all"] as const).map((r) => (
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass glass-border rounded-lg p-5 h-48 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Engagement */}
          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">Engagement</h2>
            <EngagementMetrics data={data.engagement} />
          </section>

          {/* Geography & Platforms */}
          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Geography & Platforms
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CountryBreakdown data={data.countryBreakdown} />
              <PlatformBreakdown
                data={data.platformBreakdown}
                indexRequired={data.platformIndexRequired}
              />
            </div>
          </section>

          {/* Growth & Activity */}
          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">
              Growth & Activity
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UserGrowthChart data={data.userGrowth} />
              <WatchTimeTrends data={data.watchTimeTrends} />
            </div>
          </section>

          {/* Room Analytics */}
          <section>
            <h2 className="text-sm font-display font-semibold text-outline mb-3">Rooms</h2>
            <RoomAnalytics data={data.roomStats} />
          </section>

          {/* Timestamp */}
          <p className="text-xs text-outline/50 text-right">
            Data cached at {new Date(data.generatedAt).toLocaleTimeString()}
          </p>
        </div>
      ) : null}
    </div>
  );
}
