export interface PageView {
  id: string;
  path: string;
  referrerDomain: string;
  country: string;
  ip: string;
  locale: string;
  userAgent: string;
  timestamp: string;
}

export interface PageViewAggregation {
  totalViews: number;
  uniqueIPs: number;
  byReferrer: { domain: string; count: number; percentage: number }[];
  byCountry: { code: string; count: number; percentage: number }[];
  byLocale: { locale: string; count: number; percentage: number }[];
  byPath: { path: string; count: number; percentage: number }[];
  recentViews: PageView[];
  range: string;
  generatedAt: string;
}
