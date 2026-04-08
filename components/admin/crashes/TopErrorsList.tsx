"use client";

import { AlertCircle } from "lucide-react";
import SectionCard from "../analytics/SectionCard";
import type { CrashByMessage } from "@/lib/crash-analytics-types";

interface Props {
  errors: CrashByMessage[];
}

const sourceColors: Record<string, string> = {
  "renderer-error-boundary": "bg-red-500/20 text-red-400",
  "main-unhandled-exception": "bg-red-500/20 text-red-400",
  "main-unhandled-rejection": "bg-orange-500/20 text-orange-400",
  "renderer-unhandled-exception": "bg-orange-500/20 text-orange-400",
  "renderer-unhandled-rejection": "bg-amber-500/20 text-amber-400",
  "api-failure": "bg-cyan/20 text-cyan",
  "socket-error": "bg-purple-500/20 text-purple-400",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TopErrorsList({ errors }: Props) {
  if (errors.length === 0) {
    return (
      <SectionCard title="Top Errors" icon={AlertCircle}>
        <p className="text-sm text-outline py-4 text-center">
          No errors recorded
        </p>
      </SectionCard>
    );
  }

  const max = errors[0]?.count || 1;

  return (
    <SectionCard title="Top Errors" icon={AlertCircle}>
      <div className="space-y-3">
        {errors.map((err, i) => {
          const pct = (err.count / max) * 100;
          const badgeClass =
            sourceColors[err.source] || "bg-outline/20 text-outline";

          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-text-primary truncate flex-1">
                  {err.message}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${badgeClass}`}
                  >
                    {err.source.replace(/-/g, " ")}
                  </span>
                  <span className="text-xs text-text-primary font-semibold w-10 text-right">
                    {err.count}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-low rounded overflow-hidden">
                  <div
                    className="h-full rounded bg-cta-amber-deep/50 transition-all duration-500"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <span className="text-[10px] text-outline shrink-0">
                  {timeAgo(err.lastSeen)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
