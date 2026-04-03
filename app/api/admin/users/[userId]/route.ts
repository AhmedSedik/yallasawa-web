import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import { FieldValue } from "firebase-admin/firestore";

const EDITABLE_FIELDS = ["displayName", "bio", "email", "countryCode", "avatarUrl", "emailVerified"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { userId } = await params;
  const db = getDb();
  const doc = await db.collection("users").doc(userId).get();

  if (!doc.exists) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const d = doc.data()!;
  return Response.json({
    id: doc.id,
    email: d.email || "",
    username: d.username || "",
    displayName: d.displayName || "",
    avatarUrl: d.avatarUrl || null,
    bio: d.bio || "",
    countryCode: d.countryCode || "",
    emailVerified: d.emailVerified || false,
    googleId: d.googleId || null,
    totalWatchMs: d.totalWatchMs || 0,
    longestSessionMs: d.longestSessionMs || 0,
    largestRoomSize: d.largestRoomSize || 0,
    dailyWatchMs: d.dailyWatchMs || {},
    privacy: d.privacy || {},
    createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() || null,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { userId } = await params;
  const body = await request.json();

  const db = getDb();
  const updates: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (EDITABLE_FIELDS.includes(key)) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updatedAt = FieldValue.serverTimestamp();

  await db.collection("users").doc(userId).update(updates);
  return Response.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { userId } = await params;
  const db = getDb();
  const batch = db.batch();

  // Delete user sub-collections
  const subCollections = ["watchHistory", "notifications"];
  for (const sub of subCollections) {
    const snap = await db.collection("users").doc(userId).collection(sub).get();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
  }

  // Delete user document
  batch.delete(db.collection("users").doc(userId));

  // Delete friendships
  const friendshipsA = await db.collection("friendships").where("userAId", "==", userId).get();
  const friendshipsB = await db.collection("friendships").where("userBId", "==", userId).get();
  friendshipsA.docs.forEach((doc) => batch.delete(doc.ref));
  friendshipsB.docs.forEach((doc) => batch.delete(doc.ref));

  // Delete friend requests
  const requestsSent = await db.collection("friendRequests").where("senderId", "==", userId).get();
  const requestsReceived = await db.collection("friendRequests").where("receiverId", "==", userId).get();
  requestsSent.docs.forEach((doc) => batch.delete(doc.ref));
  requestsReceived.docs.forEach((doc) => batch.delete(doc.ref));

  await batch.commit();
  return Response.json({ success: true });
}
