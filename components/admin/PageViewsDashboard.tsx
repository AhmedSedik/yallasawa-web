"use client";

import { useState, useEffect, useMemo } from "react";
import type { PageViewAggregation, PageView } from "@/lib/pageview-types";
import { countryCodeToFlag, countryName } from "@/lib/analytics-utils";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";
import { Globe, MapPin, Languages, Eye, Link2, ArrowUpDown } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d";
type SortKey = "timestamp" | "referrerDomain" | "country" | "ip" | "locale" | "path";
type SortDir = "asc" | "desc";

const rangeLabels: Record<TimeRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

const PAGE_SIZE = 25;

export default function PageViewsDashboard() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [data, setData] = useState<PageViewAggregation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/pageviews?range=${range}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load page views");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [range]);

  // Reset page when search/range changes
  useEffect(() => {
    setPage(1);
  }, [search, range]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    let list = data.recentViews;
    if (q) {
      list = list.filter(
        (v) =>
          v.referrerDomain.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.ip.includes(q) ||
          v.locale.toLowerCase().includes(q) ||
          v.path.toLowerCase().includes(q),
      );
    }
    // Sort
    list = [...list].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <button
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 text-xs font-display font-semibold text-outline hover:text-text-primary transition-colors"
      >
        {label}
        <ArrowUpDown size={12} className={sortKey === field ? "text-cta-amber-light" : "opacity-40"} />
      </button>
    );
  }

  return (
    <div>
      {/* Time range selector */}
      <div className="flex gap-2 mb-6">
        {(["7d", "30d", "90d"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              range === r
                ? "bg-cta-amber-deep/10 text-cta-amber-light"
                : "text-outline hover:bg-surface-container hover:text-text-primary"
            }`}
          >
            {rangeLabels[r]}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass glass-border rounded-lg p-5 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass glass-border rounded-lg p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={Eye} label="Total Views" value={data.totalViews.toLocaleString()} />
            <StatCard icon={Globe} label="Unique IPs" value={data.uniqueIPs.toLocaleString()} />
            <StatCard icon={Link2} label="Referrers" value={data.byReferrer.length.toLocaleString()} />
            <StatCard icon={MapPin} label="Countries" value={data.byCountry.length.toLocaleString()} />
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Top Referrers */}
            <div className="glass glass-border rounded-lg p-5">
              <h3 className="text-sm font-display font-semibold mb-3 flex items-center gap-2">
                <Link2 size={16} className="text-cta-amber-light" />
                Top Referrers
              </h3>
              <div className="space-y-2">
                {data.byReferrer.slice(0, 8).map((r) => (
                  <div key={r.domain} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary truncate mr-2">{r.domain}</span>
                    <span className="text-outline shrink-0">{r.count} ({r.percentage}%)</span>
                  </div>
                ))}
                {data.byReferrer.length === 0 && (
                  <p className="text-sm text-outline">No data</p>
                )}
              </div>
            </div>

            {/* Top Countries */}
            <div className="glass glass-border rounded-lg p-5">
              <h3 className="text-sm font-display font-semibold mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-cta-amber-light" />
                Top Countries
              </h3>
              <div className="space-y-2">
                {data.byCountry.slice(0, 8).map((c) => (
                  <div key={c.code} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">
                      {countryCodeToFlag(c.code)} {countryName(c.code)}
                    </span>
                    <span className="text-outline shrink-0">{c.count} ({c.percentage}%)</span>
                  </div>
                ))}
                {data.byCountry.length === 0 && (
                  <p className="text-sm text-outline">No data</p>
                )}
              </div>
            </div>

            {/* Locales */}
            <div className="glass glass-border rounded-lg p-5">
              <h3 className="text-sm font-display font-semibold mb-3 flex items-center gap-2">
                <Languages size={16} className="text-cta-amber-light" />
                Locales
              </h3>
              <div className="space-y-2">
                {data.byLocale.map((l) => (
                  <div key={l.locale} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{l.locale.toUpperCase()}</span>
                    <span className="text-outline shrink-0">{l.count} ({l.percentage}%)</span>
                  </div>
                ))}
                {data.byLocale.length === 0 && (
                  <p className="text-sm text-outline">No data</p>
                )}
              </div>
            </div>

            {/* Top Pages */}
            <div className="glass glass-border rounded-lg p-5">
              <h3 className="text-sm font-display font-semibold mb-3 flex items-center gap-2">
                <Eye size={16} className="text-cta-amber-light" />
                Top Pages
              </h3>
              <div className="space-y-2">
                {data.byPath.slice(0, 8).map((p) => (
                  <div key={p.path} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary truncate mr-2">{p.path}</span>
                    <span className="text-outline shrink-0">{p.count} ({p.percentage}%)</span>
                  </div>
                ))}
                {data.byPath.length === 0 && (
                  <p className="text-sm text-outline">No data</p>
                )}
              </div>
            </div>
          </div>

          {/* Page views table */}
          <div className="glass glass-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold">
                Page View Log ({filtered.length})
              </h3>
              <div className="w-72">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by domain, country, IP, path..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2.5 px-3">
                      <SortHeader label="Timestamp" field="timestamp" />
                    </th>
                    <th className="text-left py-2.5 px-3">
                      <SortHeader label="Path" field="path" />
                    </th>
                    <th className="text-left py-2.5 px-3">
                      <SortHeader label="Referrer Domain" field="referrerDomain" />
                    </th>
                    <th className="text-left py-2.5 px-3">
                      <SortHeader label="Country" field="country" />
                    </th>
                    <th className="text-left py-2.5 px-3">
                      <SortHeader label="IP Address" field="ip" />
                    </th>
                    <th className="text-left py-2.5 px-3">
                      <SortHeader label="Locale" field="locale" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((view) => (
                    <PageViewRow key={view.id} view={view} />
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-outline">
                        {search ? "No results found" : "No page views yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>

          <p className="text-xs text-outline/50 text-right">
            Data cached at {new Date(data.generatedAt).toLocaleTimeString()}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="glass glass-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-cta-amber-light" />
        <span className="text-xs text-outline">{label}</span>
      </div>
      <p className="text-xl font-display font-bold">{value}</p>
    </div>
  );
}

function PageViewRow({ view }: { view: PageView }) {
  const time = new Date(view.timestamp);
  return (
    <tr className="border-b border-white/5 hover:bg-surface-container/40 transition-colors">
      <td className="py-2.5 px-3 text-outline whitespace-nowrap">
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </td>
      <td className="py-2.5 px-3 text-text-primary max-w-[200px] truncate">{view.path}</td>
      <td className="py-2.5 px-3">
        <span className={view.referrerDomain === "direct" ? "text-outline italic" : "text-text-primary"}>
          {view.referrerDomain}
        </span>
      </td>
      <td className="py-2.5 px-3 text-text-primary whitespace-nowrap">
        {view.country ? (
          <>
            {countryCodeToFlag(view.country)} {countryName(view.country)}
          </>
        ) : (
          <span className="text-outline italic">Unknown</span>
        )}
      </td>
      <td className="py-2.5 px-3 text-outline font-mono text-xs">{view.ip}</td>
      <td className="py-2.5 px-3 text-text-primary">{view.locale.toUpperCase()}</td>
    </tr>
  );
}
