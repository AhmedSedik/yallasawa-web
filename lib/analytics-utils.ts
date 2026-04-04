export function formatMs(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function formatHours(ms: number): string {
  const h = ms / 3600000;
  if (h < 1) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(h * 10) / 10}h`;
}

export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  EG: "Egypt",
  US: "United States",
  GB: "United Kingdom",
  SA: "Saudi Arabia",
  AE: "UAE",
  KW: "Kuwait",
  QA: "Qatar",
  BH: "Bahrain",
  OM: "Oman",
  JO: "Jordan",
  LB: "Lebanon",
  IQ: "Iraq",
  SY: "Syria",
  PS: "Palestine",
  LY: "Libya",
  TN: "Tunisia",
  DZ: "Algeria",
  MA: "Morocco",
  SD: "Sudan",
  YE: "Yemen",
  DE: "Germany",
  FR: "France",
  NL: "Netherlands",
  CA: "Canada",
  AU: "Australia",
  TR: "Turkey",
  IN: "India",
  PK: "Pakistan",
  BR: "Brazil",
  IT: "Italy",
  ES: "Spain",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  JP: "Japan",
  KR: "South Korea",
  MY: "Malaysia",
  ID: "Indonesia",
  NG: "Nigeria",
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase();
}

export function getDateRangeCutoff(range: string): number {
  const now = Date.now();
  switch (range) {
    case "7d":
      return now - 7 * 86400000;
    case "30d":
      return now - 30 * 86400000;
    case "90d":
      return now - 90 * 86400000;
    default:
      return 0;
  }
}

export function toDateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function toMonthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Generate all date keys between start and end (inclusive) */
export function fillDateRange(startMs: number, endMs: number): string[] {
  const dates: string[] = [];
  const current = new Date(startMs);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endMs);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    dates.push(toDateKey(current.getTime()));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
