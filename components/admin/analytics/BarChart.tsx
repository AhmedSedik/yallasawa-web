"use client";

interface BarChartItem {
  label: string;
  value: number;
  prefix?: string;
  color?: "amber" | "cyan" | "emerald";
}

interface BarChartProps {
  items: BarChartItem[];
  maxValue?: number;
  formatValue?: (v: number) => string;
  showPercentage?: boolean;
  totalForPercentage?: number;
}

const colorMap = {
  amber: "bg-cta-amber-deep/50",
  cyan: "bg-cyan/40",
  emerald: "bg-emerald-500/40",
};

export default function BarChart({
  items,
  maxValue,
  formatValue,
  showPercentage,
  totalForPercentage,
}: BarChartProps) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);
  const total = totalForPercentage ?? items.reduce((sum, i) => sum + i.value, 0);

  if (items.length === 0) {
    return <p className="text-sm text-outline py-4 text-center">No data available</p>;
  }

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        const displayPct = total > 0 ? Math.round((item.value / total) * 1000) / 10 : 0;
        const color = colorMap[item.color || "amber"];

        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-outline w-28 truncate shrink-0">
              {item.prefix && <span className="mr-1.5">{item.prefix}</span>}
              {item.label}
            </span>
            <div className="flex-1 h-5 bg-surface-low rounded overflow-hidden">
              <div
                className={`h-full rounded ${color} transition-all duration-500`}
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
            <span className="text-xs text-text-primary w-14 text-right shrink-0">
              {formatValue ? formatValue(item.value) : item.value.toLocaleString()}
            </span>
            {showPercentage && (
              <span className="text-xs text-outline w-12 text-right shrink-0">{displayPct}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
