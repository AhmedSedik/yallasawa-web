import PageViewsDashboard from "@/components/admin/PageViewsDashboard";

export const dynamic = "force-dynamic";

export default function PageViewsPage() {
  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-6">Page Views</h1>
      <PageViewsDashboard />
    </div>
  );
}
