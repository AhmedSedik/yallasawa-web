import { NextResponse } from "next/server";
import { getLatestRelease } from "@/lib/github";

export async function GET() {
  const hasToken = !!process.env.GITHUB_TOKEN;
  const tokenPrefix = process.env.GITHUB_TOKEN?.slice(0, 8) ?? "NOT SET";
  const release = await getLatestRelease();

  return NextResponse.json({
    hasToken,
    tokenPrefix,
    release,
  });
}
