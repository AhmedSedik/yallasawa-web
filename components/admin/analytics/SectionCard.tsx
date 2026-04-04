import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export default function SectionCard({ title, children, icon: Icon, className = "" }: SectionCardProps) {
  return (
    <div className={`glass glass-border rounded-lg p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={18} className="text-cta-amber-light" />}
        <h3 className="text-sm font-display font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
