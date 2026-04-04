"use client";

import { DoorOpen, Users, Clock, BarChart3 } from "lucide-react";
import type { RoomStatsData } from "@/lib/analytics-types";
import { formatMs } from "@/lib/analytics-utils";
import StatsCard from "../StatsCard";
import SectionCard from "./SectionCard";
import TimeSeriesChart from "./TimeSeriesChart";

interface RoomAnalyticsProps {
  data: RoomStatsData;
}

export default function RoomAnalytics({ data }: RoomAnalyticsProps) {
  const totalPubPriv = data.publicVsPrivate.public + data.publicVsPrivate.private;
  const publicPct = totalPubPriv > 0 ? Math.round((data.publicVsPrivate.public / totalPubPriv) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Rooms"
          value={data.totalRoomsInPeriod}
          icon={DoorOpen}
        />
        <StatsCard
          label="Avg Peak Members"
          value={data.avgPeakMembers}
          icon={Users}
          accent="cyan"
        />
        <StatsCard
          label="Avg Room Duration"
          value={data.avgDurationMs > 0 ? formatMs(data.avgDurationMs) : "N/A"}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Room Creation Trend" icon={BarChart3}>
          <TimeSeriesChart data={data.roomCreationTrend} color="amber" />
        </SectionCard>

        <SectionCard title="Public vs Private Rooms" icon={DoorOpen}>
          {totalPubPriv === 0 ? (
            <p className="text-sm text-outline py-4 text-center">No rooms in this period</p>
          ) : (
            <div>
              {/* Split bar */}
              <div className="h-8 rounded-md overflow-hidden flex">
                <div
                  className="bg-cta-amber-deep/50 transition-all duration-500"
                  style={{ width: `${publicPct}%` }}
                />
                <div
                  className="bg-cyan/40 transition-all duration-500"
                  style={{ width: `${100 - publicPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-cta-amber-light">
                  Public: {data.publicVsPrivate.public} ({publicPct}%)
                </span>
                <span className="text-cyan">
                  Private: {data.publicVsPrivate.private} ({100 - publicPct}%)
                </span>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
