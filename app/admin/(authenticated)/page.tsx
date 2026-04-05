import { getDb } from "@/lib/firebase-admin";
import { Users, UserCheck, DoorOpen, Activity, Clock, TrendingUp, Globe, ShieldCheck, Download, Tag } from "lucide-react";
import { countryCodeToFlag, countryName } from "@/lib/analytics-utils";
import StatsCard from "@/components/admin/StatsCard";

function formatMs(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

interface ReleaseData {
  version: string;
  name: string;
  publishedAt: string;
  prerelease: boolean;
  exeDownloads: number;
  totalDownloads: number;
}

async function fetchReleases(): Promise<{ totalDownloadsAllTime: number; releases: ReleaseData[] }> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch("https://api.github.com/repos/AhmedSedik/yalla_forga/releases?per_page=20", {
      next: { revalidate: 300 },
      headers,
    });
    if (!res.ok) return { totalDownloadsAllTime: 0, releases: [] };

    const allReleases = await res.json();
    const releases: ReleaseData[] = allReleases
      .filter((r: { draft: boolean }) => !r.draft)
      .sort((a: { published_at: string }, b: { published_at: string }) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      )
      .map((r: { tag_name: string; name: string; published_at: string; prerelease: boolean; assets: Array<{ name: string; download_count: number }> }) => {
        const exe = r.assets.find((a) => a.name.endsWith(".exe"));
        return {
          version: r.tag_name,
          name: r.name,
          publishedAt: r.published_at,
          prerelease: r.prerelease,
          exeDownloads: exe?.download_count ?? 0,
          totalDownloads: r.assets.reduce((sum, a) => sum + a.download_count, 0),
        };
      });

    const totalDownloadsAllTime = releases.reduce((sum: number, r: ReleaseData) => sum + r.exeDownloads, 0);
    return { totalDownloadsAllTime, releases };
  } catch {
    return { totalDownloadsAllTime: 0, releases: [] };
  }
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = getDb();
  const usersRef = db.collection("users");
  const roomsRef = db.collection("rooms");

  const [usersSnap, roomsSnap, releaseData] = await Promise.all([
    usersRef.get(),
    roomsRef.get(),
    fetchReleases(),
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

      {/* Downloads & Releases */}
      <h2 className="text-sm font-display font-semibold text-outline mt-8 mb-3">Downloads & Releases</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <StatsCard
          label="Total Downloads"
          value={releaseData.totalDownloadsAllTime}
          subtext="All releases (exe)"
          icon={Download}
        />
        <StatsCard
          label="Latest Release"
          value={releaseData.releases[0]?.version ?? "N/A"}
          subtext={releaseData.releases[0] ? timeAgo(releaseData.releases[0].publishedAt) : ""}
          icon={Tag}
          accent="cyan"
        />
        <StatsCard
          label="Latest Downloads"
          value={releaseData.releases[0]?.exeDownloads ?? 0}
          subtext={releaseData.releases[0]?.version ?? ""}
          icon={Download}
          accent="cyan"
        />
      </div>

      {releaseData.releases.length > 0 && (
        <div className="glass glass-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-outline">Release History</span>
            <Download size={18} className="text-cta-amber-light" />
          </div>
          <div className="space-y-3">
            {releaseData.releases.map((release) => (
              <div key={release.version} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-semibold text-text-primary">
                    {release.version}
                  </span>
                  {release.prerelease && (
                    <span className="rounded-full bg-cta-amber-light/10 px-2 py-0.5 text-[10px] font-semibold text-cta-amber-light">
                      pre-release
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-outline">{timeAgo(release.publishedAt)}</span>
                  <span className="font-display font-semibold text-cyan">
                    {release.exeDownloads} <span className="text-xs text-outline font-normal">dl</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
