import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import type {
  CrashAnalyticsResponse,
  CrashByMessage,
  RecentCrash,
  VersionBreakdown,
  OsBreakdown,
} from "@/lib/crash-analytics-types";
import {
  getDateRangeCutoff,
  toDateKey,
  fillDateRange,
} from "@/lib/analytics-utils";

const cache = new Map<
  string,
  { data: CrashAnalyticsResponse; expiry: number }
>();
const CACHE_TTL = 5 * 60 * 1000;

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
}

function p95(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1];
}

export async function GET(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";
  const cacheKey = `crashes-${range}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return Response.json(cached.data);
  }

  const db = getDb();
  const cutoff = getDateRangeCutoff(range);
  const now = Date.now();
  const cutoffIso = cutoff > 0 ? new Date(cutoff).toISOString() : "";

  // Build queries
  const crashBase = db.collection("crashReports");
  const metricBase = db.collection("performanceMetrics");
  const crashQuery = cutoffIso
    ? crashBase.where("timestamp", ">=", cutoffIso).limit(5000)
    : crashBase.limit(5000);
  const metricQuery = cutoffIso
    ? metricBase.where("timestamp", ">=", cutoffIso).limit(10000)
    : metricBase.limit(10000);
  const usersQuery = db.collection("users").select().limit(50000);

  const [crashSnap, metricSnap, usersSnap] = await Promise.all([
    crashQuery.get(),
    metricQuery.get(),
    usersQuery.get(),
  ]);

  const totalUsers = usersSnap.size;

  // Aggregate crashes
  const crashTrendMap = new Map<string, number>();
  const errorMessageMap = new Map<
    string,
    { message: string; source: string; count: number; lastSeen: string }
  >();
  const versionMap = new Map<string, number>();
  const osMap = new Map<string, number>();
  const userIdSet = new Set<string>();
  const recentCrashes: RecentCrash[] = [];
  let fatalCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  crashSnap.forEach((doc) => {
    const d = doc.data();
    const ts = d.timestamp as string;
    const dateKey = toDateKey(new Date(ts).getTime());

    crashTrendMap.set(dateKey, (crashTrendMap.get(dateKey) || 0) + 1);

    if (d.severity === "fatal") fatalCount++;
    else if (d.severity === "error") errorCount++;
    else warningCount++;

    const key = `${d.message}::${d.source}`;
    const existing = errorMessageMap.get(key);
    if (existing) {
      existing.count++;
      if (ts > existing.lastSeen) existing.lastSeen = ts;
    } else {
      errorMessageMap.set(key, {
        message: d.message,
        source: d.source,
        count: 1,
        lastSeen: ts,
      });
    }

    if (d.appVersion) {
      versionMap.set(
        d.appVersion,
        (versionMap.get(d.appVersion) || 0) + 1,
      );
    }

    if (d.os) {
      const osKey = d.os.split(" ")[0];
      osMap.set(osKey, (osMap.get(osKey) || 0) + 1);
    }

    if (d.userId) userIdSet.add(d.userId);

    recentCrashes.push({
      id: doc.id,
      message: d.message,
      stack: d.stack || undefined,
      source: d.source,
      severity: d.severity,
      appVersion: d.appVersion,
      os: d.os,
      userId: d.userId || undefined,
      timestamp: ts,
      context: d.context || undefined,
    });
  });

  recentCrashes.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Crash trend
  const allDates = cutoff > 0 ? fillDateRange(cutoff, now) : [];
  const crashTrend =
    allDates.length > 0
      ? allDates.map((date) => ({
          date,
          value: crashTrendMap.get(date) || 0,
        }))
      : Array.from(crashTrendMap.entries())
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => a.date.localeCompare(b.date));

  const totalCrashes = crashSnap.size;

  const topErrors: CrashByMessage[] = Array.from(errorMessageMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const versionBreakdown: VersionBreakdown[] = Array.from(
    versionMap.entries(),
  )
    .map(([version, count]) => ({
      version,
      count,
      percentage:
        totalCrashes > 0
          ? Math.round((count / totalCrashes) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const osBreakdown: OsBreakdown[] = Array.from(osMap.entries())
    .map(([os, count]) => ({
      os,
      count,
      percentage:
        totalCrashes > 0
          ? Math.round((count / totalCrashes) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Performance metrics aggregation
  const metricsByName = new Map<string, number[]>();
  metricSnap.forEach((doc) => {
    const d = doc.data();
    const arr = metricsByName.get(d.name) || [];
    arr.push(d.value);
    metricsByName.set(d.name, arr);
  });

  const syncLatencies = metricsByName.get("sync-latency") || [];
  const buckets = [
    { label: "<25ms", max: 25, min: 0 },
    { label: "25-50ms", max: 50, min: 25 },
    { label: "50-100ms", max: 100, min: 50 },
    { label: "100-200ms", max: 200, min: 100 },
    { label: ">200ms", max: Infinity, min: 200 },
  ];
  const syncLatencyDistribution = buckets.map((b) => ({
    bucket: b.label,
    count: syncLatencies.filter((v) => v > b.min && v <= b.max).length,
  }));

  const crashFreeRate =
    totalUsers > 0
      ? Math.round(((totalUsers - userIdSet.size) / totalUsers) * 1000) / 10
      : 100;

  const result: CrashAnalyticsResponse = {
    summary: {
      totalCrashes,
      uniqueUsersAffected: userIdSet.size,
      crashFreeRate,
      fatalCount,
      errorCount,
      warningCount,
    },
    crashTrend,
    topErrors,
    versionBreakdown,
    osBreakdown,
    recentCrashes: recentCrashes.slice(0, 50),
    performance: {
      avgStartupTime: avg(metricsByName.get("app-startup") || []),
      avgMemoryUsage: avg(metricsByName.get("memory-usage") || []),
      avgSyncLatency: avg(syncLatencies),
      p95SyncLatency: p95(syncLatencies),
      avgApiResponseTime: avg(metricsByName.get("api-response-time") || []),
      syncLatencyDistribution,
    },
    range,
    generatedAt: new Date().toISOString(),
  };

  cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });
  return Response.json(result);
}
