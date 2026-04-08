import type { TimeSeriesPoint } from "./analytics-types";

export interface CrashSummary {
  totalCrashes: number;
  uniqueUsersAffected: number;
  crashFreeRate: number;
  fatalCount: number;
  errorCount: number;
  warningCount: number;
}

export interface CrashByMessage {
  message: string;
  source: string;
  count: number;
  lastSeen: string;
}

export interface VersionBreakdown {
  version: string;
  count: number;
  percentage: number;
}

export interface OsBreakdown {
  os: string;
  count: number;
  percentage: number;
}

export interface RecentCrash {
  id: string;
  message: string;
  stack?: string;
  source: string;
  severity: string;
  appVersion: string;
  os: string;
  userId?: string;
  timestamp: string;
  context?: Record<string, string>;
}

export interface PerformanceSummary {
  avgStartupTime: number;
  avgMemoryUsage: number;
  avgSyncLatency: number;
  p95SyncLatency: number;
  avgApiResponseTime: number;
  syncLatencyDistribution: Array<{ bucket: string; count: number }>;
}

export interface CrashAnalyticsResponse {
  summary: CrashSummary;
  crashTrend: TimeSeriesPoint[];
  topErrors: CrashByMessage[];
  versionBreakdown: VersionBreakdown[];
  osBreakdown: OsBreakdown[];
  recentCrashes: RecentCrash[];
  performance: PerformanceSummary;
  range: string;
  generatedAt: string;
}
