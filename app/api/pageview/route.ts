import { getDb } from "@/lib/firebase-admin";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, locale, referrer } = body as {
      path?: string;
      locale?: string;
      referrer?: string;
    };

    if (!path) {
      return Response.json({ error: "Missing path" }, { status: 400 });
    }

    const headersList = await headers();

    // Extract IP from various headers
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Extract country from Cloudflare/Railway headers
    const country =
      headersList.get("cf-ipcountry") ||
      headersList.get("x-vercel-ip-country") ||
      headersList.get("x-country") ||
      "";

    const userAgent = headersList.get("user-agent") || "";

    // Parse referrer domain
    let referrerDomain = "direct";
    if (referrer) {
      try {
        const url = new URL(referrer);
        // Don't log self-referrals
        if (
          !url.hostname.includes("yalla-sawa.com") &&
          !url.hostname.includes("localhost")
        ) {
          referrerDomain = url.hostname;
        }
      } catch {
        // Invalid URL, keep as "direct"
      }
    }

    const db = getDb();
    await db.collection("pageViews").add({
      path,
      locale: locale || "en",
      referrerDomain,
      country: country.toUpperCase(),
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to log" }, { status: 500 });
  }
}
