import { getDb } from "@/lib/firebase-admin";
import { Users, UserCheck, DoorOpen, Activity, Clock, TrendingUp } from "lucide-react";
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

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  usersSnap.forEach((doc) => {
    const data = doc.data();
    totalUsers++;
    if (data.emailVerified) verifiedUsers++;
    if (data.totalWatchMs) totalWatchTimeMs += data.totalWatchMs;
    const createdAt = data.createdAt?.toMillis?.() ?? 0;
    if (createdAt > sevenDaysAgo) usersLast7Days++;
  });

  let totalRooms = 0;
  let activeRooms = 0;

  roomsSnap.forEach((doc) => {
    const data = doc.data();
    totalRooms++;
    if (data.status === "active") activeRooms++;
  });

  const verifiedPct = totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

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
    </div>
  );
}
