import CrashDashboard from "@/components/admin/CrashDashboard";

export const dynamic = "force-dynamic";

export default function CrashesPage() {
  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-6">
        Crashes & Performance
      </h1>
      <CrashDashboard />
    </div>
  );
}
