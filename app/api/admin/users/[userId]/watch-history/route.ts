import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { userId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const db = getDb();

  const snap = await db
    .collection("users")
    .doc(userId)
    .collection("watchHistory")
    .orderBy("watchedAt", "desc")
    .limit(limit)
    .get();

  const history = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      url: d.url || "",
      platform: d.platform || "",
      title: d.title || "",
      watchedAt: d.watchedAt?.toDate?.()?.toISOString() || null,
      durationMs: d.durationMs || 0,
      roomCode: d.roomCode || null,
      thumbnailUrl: d.thumbnailUrl || null,
    };
  });

  return Response.json({ history });
}
