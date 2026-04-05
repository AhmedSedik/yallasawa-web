const REPO = "AhmedSedik/yalla_forga";
const FALLBACK_VERSION = "0.8.1-beta";
const FALLBACK_URL = `https://github.com/${REPO}/releases/download/v${FALLBACK_VERSION}/YallaSawa.Setup.${FALLBACK_VERSION}.exe`;

export interface ReleaseInfo {
  version: string;
  downloadUrl: string;
}

export async function getLatestRelease(): Promise<ReleaseInfo> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch recent releases and pick the most recently published one
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, {
      next: { revalidate: 300 }, // revalidate every 5 minutes
      headers,
    });

    if (!res.ok) {
      console.error(`[GitHub Release] API error: ${res.status} ${res.statusText}`);
      throw new Error(`GitHub API ${res.status}`);
    }

    const releases: Array<{
      tag_name: string;
      published_at: string;
      draft: boolean;
      assets: Array<{ name: string; browser_download_url: string }>;
    }> = await res.json();

    // Filter out drafts and sort by published_at descending
    const published = releases
      .filter((r) => !r.draft)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    const data = published[0];
    if (!data) {
      console.error("[GitHub Release] No published releases found");
      throw new Error("No releases found");
    }

    const tag: string = data.tag_name?.replace(/^v/, "") ?? FALLBACK_VERSION;

    const exeAsset = data.assets?.find(
      (a) => a.name.endsWith(".exe")
    );

    console.log(`[GitHub Release] Found: v${tag}, exe: ${exeAsset?.name ?? "NONE"}`);

    return {
      version: tag,
      downloadUrl: exeAsset?.browser_download_url ?? FALLBACK_URL,
    };
  } catch (err) {
    console.error("[GitHub Release] Fallback used:", err);
    return { version: FALLBACK_VERSION, downloadUrl: FALLBACK_URL };
  }
}
