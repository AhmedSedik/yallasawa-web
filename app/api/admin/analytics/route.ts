import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import type { AnalyticsResponse, CountryData, TimeSeriesPoint, PlatformData } from "@/lib/analytics-types";
import { getDateRangeCutoff, toDateKey, toMonthKey, fillDateRange } from "@/lib/analytics-utils";
import { Timestamp } from "firebase-admin/firestore";

const cache = new Map<string, { data: AnalyticsResponse; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";
  const cacheKey = range;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return Response.json(cached.data);
  }

  const db = getDb();
  const cutoff = getDateRangeCutoff(range);
  const now = Date.now();

  // Fetch users and rooms in parallel; watchHistory collection group separately
  let watchHistoryDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  let platformIndexRequired = false;

  const [usersSnap, roomsSnap] = await Promise.all([
    db.collection("users").get(),
    db.collection("rooms").get(),
  ]);

  // Try collection group query for platform breakdown
  try {
    const cutoffTs = cutoff > 0 ? Timestamp.fromMillis(cutoff) : Timestamp.fromMillis(0);
    const whQuery = db
      .collectionGroup("watchHistory")
      .where("watchedAt", ">", cutoffTs)
      .limit(5000);
    const whSnap = await whQuery.get();
    watchHistoryDocs = whSnap.docs;
  } catch {
    platformIndexRequired = true;
  }

  // --- Aggregate users ---
  const countryMap = new Map<string, number>();
  const userGrowthMap = new Map<string, number>();
  const watchTimeMap = new Map<string, number>();
  let verifiedCount = 0;
  let googleAuthCount = 0;
  let activeUsers7d = 0;
  let activeUsers30d = 0;
  const totalUsers = usersSnap.size;

  const sevenDaysAgo = now - 7 * 86400000;
  const thirtyDaysAgo = now - 30 * 86400000;

  usersSnap.forEach((doc) => {
    const data = doc.data();

    // Country
    if (data.countryCode) {
      const cc = (data.countryCode as string).toUpperCase();
      countryMap.set(cc, (countryMap.get(cc) || 0) + 1);
    }

    // Verified
    if (data.emailVerified) verifiedCount++;

    // Google auth
    if (data.googleId) googleAuthCount++;

    // User growth (by createdAt)
    const createdAtMs = data.createdAt?.toMillis?.() ?? 0;
    if (createdAtMs > 0 && (cutoff === 0 || createdAtMs >= cutoff)) {
      const key = range === "all" ? toMonthKey(createdAtMs) : toDateKey(createdAtMs);
      userGrowthMap.set(key, (userGrowthMap.get(key) || 0) + 1);
    }

    // Watch time trends from dailyWatchMs
    const dailyWatch = data.dailyWatchMs as Record<string, number> | undefined;
    if (dailyWatch) {
      let hasRecent7d = false;
      let hasRecent30d = false;

      for (const [dateStr, ms] of Object.entries(dailyWatch)) {
        const dateMs = new Date(dateStr).getTime();
        if (cutoff === 0 || dateMs >= cutoff) {
          watchTimeMap.set(dateStr, (watchTimeMap.get(dateStr) || 0) + ms);
        }
        if (dateMs > sevenDaysAgo) hasRecent7d = true;
        if (dateMs > thirtyDaysAgo) hasRecent30d = true;
      }

      if (hasRecent7d) activeUsers7d++;
      if (hasRecent30d) activeUsers30d++;
    }
  });

  // --- Country breakdown ---
  const countryBreakdown: CountryData[] = Array.from(countryMap.entries())
    .map(([code, count]) => ({
      code,
      count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // --- User growth timeline ---
  let userGrowth: TimeSeriesPoint[];
  if (range === "all") {
    userGrowth = Array.from(userGrowthMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else {
    const allDates = fillDateRange(cutoff, now);
    userGrowth = allDates.map((date) => ({
      date,
      value: userGrowthMap.get(date) || 0,
    }));
  }

  // --- Watch time trends ---
  let watchTimeTrends: TimeSeriesPoint[];
  if (range === "all") {
    // Aggregate by month
    const monthMap = new Map<string, number>();
    for (const [dateStr, ms] of watchTimeMap.entries()) {
      const mKey = toMonthKey(new Date(dateStr).getTime());
      monthMap.set(mKey, (monthMap.get(mKey) || 0) + ms);
    }
    watchTimeTrends = Array.from(monthMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else {
    const allDates = fillDateRange(cutoff, now);
    watchTimeTrends = allDates.map((date) => ({
      date,
      value: watchTimeMap.get(date) || 0,
    }));
  }

  // --- Platform breakdown ---
  const platformMap = new Map<string, number>();
  for (const doc of watchHistoryDocs) {
    const platform = (doc.data().platform as string) || "unknown";
    platformMap.set(platform, (platformMap.get(platform) || 0) + 1);
  }
  const totalPlatformEntries = watchHistoryDocs.length;
  const platformBreakdown: PlatformData[] = Array.from(platformMap.entries())
    .map(([platform, count]) => ({
      platform,
      count,
      percentage: totalPlatformEntries > 0 ? Math.round((count / totalPlatformEntries) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // --- Room stats ---
  const roomCreationMap = new Map<string, number>();
  let publicRooms = 0;
  let privateRooms = 0;
  let totalPeakMembers = 0;
  let totalDurationMs = 0;
  let endedRoomCount = 0;
  let roomsInPeriod = 0;

  roomsSnap.forEach((doc) => {
    const data = doc.data();
    if (data.isBot) return;

    const createdAtMs = data.createdAt?.toMillis?.() ?? 0;
    if (cutoff > 0 && createdAtMs < cutoff) return;

    roomsInPeriod++;
    totalPeakMembers += data.peakMembers || 0;

    if (data.privacy === "PUBLIC") publicRooms++;
    else privateRooms++;

    const key = range === "all" ? toMonthKey(createdAtMs) : toDateKey(createdAtMs);
    roomCreationMap.set(key, (roomCreationMap.get(key) || 0) + 1);

    if (data.status === "ended" && data.endedAt) {
      const endedMs = data.endedAt.toMillis?.() ?? 0;
      if (endedMs > createdAtMs) {
        totalDurationMs += endedMs - createdAtMs;
        endedRoomCount++;
      }
    }
  });

  let roomCreationTrend: TimeSeriesPoint[];
  if (range === "all") {
    roomCreationTrend = Array.from(roomCreationMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else {
    const allDates = fillDateRange(cutoff, now);
    roomCreationTrend = allDates.map((date) => ({
      date,
      value: roomCreationMap.get(date) || 0,
    }));
  }

  const result: AnalyticsResponse = {
    countryBreakdown,
    userGrowth,
    watchTimeTrends,
    platformBreakdown,
    platformIndexRequired,
    roomStats: {
      avgPeakMembers: roomsInPeriod > 0 ? Math.round((totalPeakMembers / roomsInPeriod) * 10) / 10 : 0,
      roomCreationTrend,
      publicVsPrivate: { public: publicRooms, private: privateRooms },
      avgDurationMs: endedRoomCount > 0 ? Math.round(totalDurationMs / endedRoomCount) : 0,
      totalRoomsInPeriod: roomsInPeriod,
    },
    engagement: {
      verificationRate: totalUsers > 0 ? Math.round((verifiedCount / totalUsers) * 1000) / 10 : 0,
      googleAuthCount,
      emailOnlyCount: totalUsers - googleAuthCount,
      activeUsers7d,
      activeUsers30d,
      totalUsers,
    },
    range,
    generatedAt: new Date().toISOString(),
  };

  cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });

  return Response.json(result);
}
