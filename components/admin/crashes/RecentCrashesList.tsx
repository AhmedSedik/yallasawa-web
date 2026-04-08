"use client";

import { useState } from "react";
import { List } from "lucide-react";
import SectionCard from "../analytics/SectionCard";
import type { RecentCrash } from "@/lib/crash-analytics-types";

interface Props {
  crashes: RecentCrash[];
}

const severityBadge: Record<string, string> = {
  fatal: "bg-red-500/20 text-red-400",
  error: "bg-amber-500/20 text-amber-400",
  warning: "bg-outline/20 text-outline",
};

export default function RecentCrashesList({ crashes }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (crashes.length === 0) {
    return (
      <SectionCard title="Recent Crashes" icon={List}>
        <p className="text-sm text-outline py-4 text-center">
          No crashes recorded
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Recent Crashes" icon={List}>
      <div className="space-y-1 max-h-[500px] overflow-y-auto">
        {crashes.map((crash) => {
          const isOpen = expanded === crash.id;
          const badge = severityBadge[crash.severity] || severityBadge.warning;

          return (
            <div key={crash.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : crash.id)}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${badge}`}>
                    {crash.severity}
                  </span>
                  <span className="text-xs text-text-primary truncate flex-1">
                    {crash.message}
                  </span>
                  <span className="text-[10px] text-outline shrink-0">
                    {crash.appVersion}
                  </span>
                  <span className="text-[10px] text-outline shrink-0">
                    {new Date(crash.timestamp).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="mx-3 mb-2 p-3 rounded-md bg-surface-low text-xs space-y-2">
                  <div className="flex gap-4 text-outline">
                    <span>Source: {crash.source}</span>
                    <span>OS: {crash.os}</span>
                    {crash.userId && <span>User: {crash.userId.slice(0, 8)}...</span>}
                  </div>
                  {crash.context && Object.keys(crash.context).length > 0 && (
                    <div className="text-outline">
                      {Object.entries(crash.context).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-text-primary">{k}:</span> {v}
                        </div>
                      ))}
                    </div>
                  )}
                  {crash.stack && (
                    <pre className="text-[11px] text-outline/80 whitespace-pre-wrap break-all max-h-60 overflow-y-auto font-mono bg-surface-container p-2 rounded">
                      {crash.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
