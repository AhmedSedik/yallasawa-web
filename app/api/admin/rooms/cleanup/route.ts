import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const db = getDb();
  const { action } = await request.json();
  // action: "close-stale" | "delete-non-bot"

  if (action === "close-stale") {
    // Mark all "active" rooms as "ended" (stale from crashes)
    const snap = await db.collection("rooms").where("status", "==", "active").get();
    let closed = 0;

    const batchSize = 500;
    for (let i = 0; i < snap.docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = snap.docs.slice(i, i + batchSize);
      chunk.forEach((doc) => {
        if (!doc.data().isBot) {
          batch.update(doc.ref, {
            status: "ended",
            endedAt: FieldValue.serverTimestamp(),
          });
          closed++;
        }
      });
      await batch.commit();
    }

    return Response.json({ success: true, closed });
  }

  if (action === "delete-non-bot") {
    // Delete all rooms that are NOT flagged as bot
    const snap = await db.collection("rooms").get();
    let deleted = 0;

    const batchSize = 500;
    for (let i = 0; i < snap.docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = snap.docs.slice(i, i + batchSize);
      chunk.forEach((doc) => {
        if (!doc.data().isBot) {
          batch.delete(doc.ref);
          deleted++;
        }
      });
      await batch.commit();
    }

    return Response.json({ success: true, deleted });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
