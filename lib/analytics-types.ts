export interface CountryData {
  code: string;
  count: number;
  percentage: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface PlatformData {
  platform: string;
  count: number;
  percentage: number;
}

export interface RoomStatsData {
  avgPeakMembers: number;
  roomCreationTrend: TimeSeriesPoint[];
  publicVsPrivate: { public: number; private: number };
  avgDurationMs: number;
  totalRoomsInPeriod: number;
}

export interface EngagementData {
  verificationRate: number;
  googleAuthCount: number;
  emailOnlyCount: number;
  activeUsers7d: number;
  activeUsers30d: number;
  totalUsers: number;
}

export interface AnalyticsResponse {
  countryBreakdown: CountryData[];
  userGrowth: TimeSeriesPoint[];
  watchTimeTrends: TimeSeriesPoint[];
  platformBreakdown: PlatformData[];
  platformIndexRequired: boolean;
  roomStats: RoomStatsData;
  engagement: EngagementData;
  range: string;
  generatedAt: string;
}
