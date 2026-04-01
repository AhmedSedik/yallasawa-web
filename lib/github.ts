const REPO = "AhmedSedik/yalla_forga";
const FALLBACK_VERSION = "0.6.1-beta";
const FALLBACK_URL = `https://github.com/${REPO}/releases/latest/download/YallaSawa.Setup.${FALLBACK_VERSION}.exe`;

export interface ReleaseInfo {
  version: string;
  downloadUrl: string;
}

export async function getLatestRelease(): Promise<ReleaseInfo> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      next: { revalidate: 300 }, // revalidate every 5 minutes
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const data = await res.json();
    const tag: string = data.tag_name?.replace(/^v/, "") ?? FALLBACK_VERSION;

    const exeAsset = data.assets?.find(
      (a: { name: string }) => a.name.endsWith(".exe")
    );

    return {
      version: tag,
      downloadUrl: exeAsset?.browser_download_url ?? FALLBACK_URL,
    };
  } catch {
    return { version: FALLBACK_VERSION, downloadUrl: FALLBACK_URL };
  }
}
