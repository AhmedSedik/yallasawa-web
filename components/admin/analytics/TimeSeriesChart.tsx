"use client";

import { useState } from "react";

interface TimeSeriesPoint {
  date: string;
  value: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  formatValue?: (v: number) => string;
  formatDate?: (d: string) => string;
  color?: "amber" | "cyan";
  height?: number;
}

const barColors = {
  amber: "bg-cta-amber-deep/60 hover:bg-cta-amber-deep/80",
  cyan: "bg-cyan/50 hover:bg-cyan/70",
};

function defaultFormatDate(d: string): string {
  // "2024-01-15" -> "Jan 15" or "2024-01" -> "Jan '24"
  if (d.length === 7) {
    const [y, m] = d.split("-");
    const month = new Date(Number(y), Number(m) - 1).toLocaleDateString("en", { month: "short" });
    return `${month} '${y.slice(2)}`;
  }
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export default function TimeSeriesChart({
  data,
  formatValue,
  formatDate = defaultFormatDate,
  color = "amber",
  height = 180,
}: TimeSeriesChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const barColor = barColors[color];

  if (data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <p className="text-sm text-outline">No data available</p>
      </div>
    );
  }

  // Show every Nth label to avoid crowding
  const labelInterval = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div>
      <div className="relative" style={{ height }}>
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 glass glass-border rounded-md px-2.5 py-1.5 text-xs z-10 pointer-events-none whitespace-nowrap">
            <span className="text-outline">{formatDate(data[hoveredIndex].date)}</span>
            <span className="ml-2 text-text-primary font-semibold">
              {formatValue ? formatValue(data[hoveredIndex].value) : data[hoveredIndex].value.toLocaleString()}
            </span>
          </div>
        )}

        {/* Bars */}
        <div className="flex items-end gap-px h-full">
          {data.map((point, i) => {
            const barHeight = max > 0 ? (point.value / max) * 100 : 0;
            return (
              <div
                key={point.date}
                className="flex-1 flex items-end min-w-0"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`w-full rounded-t transition-all duration-300 ${barColor} ${point.value === 0 ? "opacity-20" : ""}`}
                  style={{ height: `${Math.max(barHeight, 2)}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex mt-2">
        {data.map((point, i) => (
          <div key={point.date} className="flex-1 min-w-0 text-center">
            {i % labelInterval === 0 && (
              <span className="text-[10px] text-outline">{formatDate(point.date)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
