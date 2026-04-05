import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

const REPO = "AhmedSedik/yalla_forga";

interface GitHubAsset {
  name: string;
  download_count: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: GitHubAsset[];
}

export async function GET() {
  if (!(await validateAdminRequest())) return unauthorized();

  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=20`, {
      next: { revalidate: 300 },
      headers,
    });

    if (!res.ok) {
      return Response.json({ error: `GitHub API ${res.status}` }, { status: 502 });
    }

    const allReleases: GitHubRelease[] = await res.json();

    const releases = allReleases
      .filter((r) => !r.draft)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .map((r) => {
        const exe = r.assets.find((a) => a.name.endsWith(".exe"));
        const totalDownloads = r.assets.reduce((sum, a) => sum + a.download_count, 0);
        const exeDownloads = exe?.download_count ?? 0;

        return {
          version: r.tag_name,
          name: r.name,
          publishedAt: r.published_at,
          prerelease: r.prerelease,
          exeDownloads,
          totalDownloads,
        };
      });

    const totalDownloadsAllTime = releases.reduce((sum, r) => sum + r.exeDownloads, 0);

    return Response.json({
      totalDownloadsAllTime,
      releases,
    });
  } catch {
    return Response.json({ error: "Failed to fetch releases" }, { status: 502 });
  }
}
