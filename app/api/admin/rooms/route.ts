import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

export async function GET(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const status = searchParams.get("status"); // "active", "ended", or null

  let query: FirebaseFirestore.Query = db.collection("rooms").orderBy("createdAt", "desc");

  if (status) {
    query = query.where("status", "==", status);
  }

  const allSnap = await query.get();
  const total = allSnap.size;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const pageDocs = allSnap.docs.slice(start, start + limit);

  const rooms = pageDocs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      code: d.code || "",
      title: d.title || "",
      hostUserId: d.hostUserId || null,
      privacy: d.privacy || "PRIVATE",
      status: d.status || "ended",
      memberCount: d.memberCount || 0,
      peakMembers: d.peakMembers || 0,
      totalUniqueMembers: d.totalUniqueMembers?.length || 0,
      isBot: d.isBot || false,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
      endedAt: d.endedAt?.toDate?.()?.toISOString() || null,
    };
  });

  return Response.json({ rooms, total, page, totalPages });
}
