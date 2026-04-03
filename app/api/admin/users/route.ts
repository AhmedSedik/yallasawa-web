import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

export async function GET(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const verified = searchParams.get("verified"); // "true", "false", or null

  let query: FirebaseFirestore.Query = db.collection("users");

  if (search) {
    query = query
      .where("usernameLower", ">=", search)
      .where("usernameLower", "<=", search + "\uf8ff")
      .orderBy("usernameLower");
  } else {
    query = query.orderBy("createdAt", "desc");
  }

  const allSnap = await query.get();

  let docs = allSnap.docs;

  // Filter by verified status in-memory (Firestore can't combine inequality + orderBy on different fields)
  if (verified === "true") {
    docs = docs.filter((d) => d.data().emailVerified === true);
  } else if (verified === "false") {
    docs = docs.filter((d) => d.data().emailVerified !== true);
  }

  const total = docs.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const pageDocs = docs.slice(start, start + limit);

  const users = pageDocs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      email: d.email || "",
      username: d.username || "",
      displayName: d.displayName || "",
      avatarUrl: d.avatarUrl || null,
      emailVerified: d.emailVerified || false,
      totalWatchMs: d.totalWatchMs || 0,
      longestSessionMs: d.longestSessionMs || 0,
      largestRoomSize: d.largestRoomSize || 0,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
    };
  });

  return Response.json({ users, total, page, totalPages });
}
