import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { userId } = await params;
  const db = getDb();

  // Query both directions
  const [snapA, snapB] = await Promise.all([
    db.collection("friendships").where("userAId", "==", userId).get(),
    db.collection("friendships").where("userBId", "==", userId).get(),
  ]);

  const friendIds: string[] = [];
  snapA.docs.forEach((doc) => friendIds.push(doc.data().userBId));
  snapB.docs.forEach((doc) => friendIds.push(doc.data().userAId));

  if (friendIds.length === 0) {
    return Response.json({ friends: [] });
  }

  // Fetch friend details (batch in chunks of 30 for Firestore `in` limit)
  const friends: { id: string; username: string; displayName: string; avatarUrl: string | null }[] = [];
  for (let i = 0; i < friendIds.length; i += 30) {
    const chunk = friendIds.slice(i, i + 30);
    const snap = await db.collection("users").where("__name__", "in", chunk).get();
    snap.docs.forEach((doc) => {
      const d = doc.data();
      friends.push({
        id: doc.id,
        username: d.username || "",
        displayName: d.displayName || "",
        avatarUrl: d.avatarUrl || null,
      });
    });
  }

  return Response.json({ friends });
}
