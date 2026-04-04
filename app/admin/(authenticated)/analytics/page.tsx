import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-6">Analytics</h1>
      <AnalyticsDashboard />
    </div>
  );
}
