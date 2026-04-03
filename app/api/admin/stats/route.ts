import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";

export async function GET() {
  if (!(await validateAdminRequest())) return unauthorized();

  const db = getDb();
  const usersRef = db.collection("users");
  const roomsRef = db.collection("rooms");

  const [usersSnap, roomsSnap] = await Promise.all([
    usersRef.get(),
    roomsRef.get(),
  ]);

  let totalUsers = 0;
  let verifiedUsers = 0;
  let totalWatchTimeMs = 0;
  let usersLast7Days = 0;
  let usersLast30Days = 0;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  usersSnap.forEach((doc) => {
    const data = doc.data();
    totalUsers++;
    if (data.emailVerified) verifiedUsers++;
    if (data.totalWatchMs) totalWatchTimeMs += data.totalWatchMs;

    const createdAt = data.createdAt?.toMillis?.() ?? 0;
    if (createdAt > sevenDaysAgo) usersLast7Days++;
    if (createdAt > thirtyDaysAgo) usersLast30Days++;
  });

  let totalRooms = 0;
  let activeRooms = 0;

  roomsSnap.forEach((doc) => {
    const data = doc.data();
    totalRooms++;
    if (data.status === "active") activeRooms++;
  });

  return Response.json({
    totalUsers,
    verifiedUsers,
    totalWatchTimeMs,
    usersLast7Days,
    usersLast30Days,
    totalRooms,
    activeRooms,
  });
}
