import { getDb } from "@/lib/firebase-admin";
import { Users, UserCheck, DoorOpen, Activity, Clock, TrendingUp, Globe, ShieldCheck } from "lucide-react";
import { countryCodeToFlag, countryName } from "@/lib/analytics-utils";
import StatsCard from "@/components/admin/StatsCard";

function formatMs(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = getDb();
  const usersRef = db.collection("users");
  const roomsRef = db.collection("rooms");

  const [usersSnap, roomsSnap] = await Promise.all([
    usersRef.get(),
    roomsRef.get(),
  ]);

  let totalUsers = 0;
  let verifiedUsers = 0;
  let totalWatchTimeMs = 0;
  let usersLast7Days = 0;
  let activeUsers30d = 0;
  let googleAuthUsers = 0;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const countryMap = new Map<string, number>();

  usersSnap.forEach((doc) => {
    const data = doc.data();
    totalUsers++;
    if (data.emailVerified) verifiedUsers++;
    if (data.totalWatchMs) totalWatchTimeMs += data.totalWatchMs;
    const createdAt = data.createdAt?.toMillis?.() ?? 0;
    if (createdAt > sevenDaysAgo) usersLast7Days++;

    // Country
    if (data.countryCode) {
      const cc = (data.countryCode as string).toUpperCase();
      countryMap.set(cc, (countryMap.get(cc) || 0) + 1);
    }

    // Active in last 30 days
    const dailyWatch = data.dailyWatchMs as Record<string, number> | undefined;
    if (dailyWatch) {
      const hasRecent = Object.keys(dailyWatch).some(
        (dateStr) => new Date(dateStr).getTime() > thirtyDaysAgo,
      );
      if (hasRecent) activeUsers30d++;
    }

    // Google auth
    if (data.googleId) googleAuthUsers++;
  });

  let totalRooms = 0;
  let activeRooms = 0;

  roomsSnap.forEach((doc) => {
    const data = doc.data();
    totalRooms++;
    if (data.status === "active") activeRooms++;
  });

  const verifiedPct = totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;
  const activePct = totalUsers > 0 ? Math.round((activeUsers30d / totalUsers) * 100) : 0;
  const googlePct = totalUsers > 0 ? Math.round((googleAuthUsers / totalUsers) * 100) : 0;

  // Top 5 countries
  const topCountries = Array.from(countryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          label="Total Users"
          value={totalUsers}
          subtext={`+${usersLast7Days} this week`}
          icon={Users}
        />
        <StatsCard
          label="Verified Users"
          value={verifiedUsers}
          subtext={`${verifiedPct}% of total`}
          icon={UserCheck}
          accent="cyan"
        />
        <StatsCard
          label="Total Watch Time"
          value={formatMs(totalWatchTimeMs)}
          icon={Clock}
        />
        <StatsCard
          label="Total Rooms"
          value={totalRooms}
          icon={DoorOpen}
          accent="cyan"
        />
        <StatsCard
          label="Active Rooms"
          value={activeRooms}
          icon={Activity}
        />
        <StatsCard
          label="Avg Watch / User"
          value={totalUsers > 0 ? formatMs(Math.round(totalWatchTimeMs / totalUsers)) : "0m"}
          icon={TrendingUp}
          accent="cyan"
        />
      </div>

      {/* Quick Insights */}
      <h2 className="text-sm font-display font-semibold text-outline mt-8 mb-3">Quick Insights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          label="Active Users (30d)"
          value={activeUsers30d}
          subtext={`${activePct}% of total`}
          icon={Activity}
          accent="cyan"
        />
        <StatsCard
          label="Google Auth"
          value={googleAuthUsers}
          subtext={`${googlePct}% of users`}
          icon={ShieldCheck}
        />
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-outline">Top Countries</span>
            <Globe size={18} className="text-cta-amber-light" />
          </div>
          {topCountries.length === 0 ? (
            <p className="text-xs text-outline">No country data</p>
          ) : (
            <div className="space-y-1.5">
              {topCountries.map(([code, count]) => (
                <div key={code} className="flex justify-between text-sm">
                  <span>
                    {countryCodeToFlag(code)} {countryName(code)}
                  </span>
                  <span className="text-outline">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
