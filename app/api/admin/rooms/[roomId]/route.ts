import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { roomId } = await params;
  const db = getDb();
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (typeof body.isBot === "boolean") {
    updates.isBot = body.isBot;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields" }, { status: 400 });
  }

  await db.collection("rooms").doc(roomId).update(updates);
  return Response.json({ success: true });
}
