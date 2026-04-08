import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import type { PageView, PageViewAggregation } from "@/lib/pageview-types";
import { getDateRangeCutoff } from "@/lib/analytics-utils";

const cache = new Map<string, { data: PageViewAggregation; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";
  const cacheKey = `pageviews-${range}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return Response.json(cached.data);
  }

  const db = getDb();
  const cutoff = getDateRangeCutoff(range);
  const cutoffIso = cutoff > 0 ? new Date(cutoff).toISOString() : "";

  const base = db.collection("pageViews");
  const query = cutoffIso
    ? base.where("timestamp", ">=", cutoffIso).orderBy("timestamp", "desc").limit(10000)
    : base.orderBy("timestamp", "desc").limit(10000);

  const snap = await query.get();

  const referrerMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  const localeMap = new Map<string, number>();
  const pathMap = new Map<string, number>();
  const ipSet = new Set<string>();
  const recentViews: PageView[] = [];

  snap.forEach((doc) => {
    const d = doc.data();

    referrerMap.set(d.referrerDomain, (referrerMap.get(d.referrerDomain) || 0) + 1);
    if (d.country) {
      countryMap.set(d.country, (countryMap.get(d.country) || 0) + 1);
    }
    localeMap.set(d.locale, (localeMap.get(d.locale) || 0) + 1);
    pathMap.set(d.path, (pathMap.get(d.path) || 0) + 1);
    if (d.ip) ipSet.add(d.ip);

    recentViews.push({
      id: doc.id,
      path: d.path,
      referrerDomain: d.referrerDomain,
      country: d.country || "",
      ip: d.ip || "unknown",
      locale: d.locale,
      userAgent: d.userAgent || "",
      timestamp: d.timestamp,
    });
  });

  const total = snap.size;

  function toSorted(map: Map<string, number>, keyName: string) {
    return Array.from(map.entries())
      .map(([key, count]) => ({
        [keyName]: key,
        count,
        percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  const result: PageViewAggregation = {
    totalViews: total,
    uniqueIPs: ipSet.size,
    byReferrer: toSorted(referrerMap, "domain") as PageViewAggregation["byReferrer"],
    byCountry: toSorted(countryMap, "code") as PageViewAggregation["byCountry"],
    byLocale: toSorted(localeMap, "locale") as PageViewAggregation["byLocale"],
    byPath: toSorted(pathMap, "path") as PageViewAggregation["byPath"],
    recentViews: recentViews.slice(0, 200),
    range,
    generatedAt: new Date().toISOString(),
  };

  cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });
  return Response.json(result);
}
