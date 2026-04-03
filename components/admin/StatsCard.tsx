import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  accent?: "amber" | "cyan";
}

export default function StatsCard({ label, value, subtext, icon: Icon, accent = "amber" }: StatsCardProps) {
  const accentColor = accent === "amber" ? "text-cta-amber-light" : "text-cyan";

  return (
    <div className="glass glass-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-outline">{label}</span>
        <Icon size={18} className={accentColor} />
      </div>
      <p className={`text-2xl font-display font-bold ${accentColor}`}>{value}</p>
      {subtext && <p className="text-xs text-outline mt-1">{subtext}</p>}
    </div>
  );
}
