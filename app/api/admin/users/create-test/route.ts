import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { username, displayName, email } = await request.json();
  const db = getDb();

  if (!username || username.length < 3 || username.length > 20) {
    return Response.json({ error: "Username must be 3-20 characters" }, { status: 400 });
  }

  // Check username uniqueness
  const existing = await db
    .collection("users")
    .where("usernameLower", "==", username.toLowerCase())
    .limit(1)
    .get();

  if (!existing.empty) {
    return Response.json({ error: "Username already taken" }, { status: 409 });
  }

  const testEmail = email || `${username.toLowerCase()}@test.yallasawa.local`;

  const docRef = db.collection("users").doc();
  await docRef.set({
    email: testEmail,
    username,
    usernameLower: username.toLowerCase(),
    displayName: displayName || username,
    passwordHash: null,
    googleId: null,
    avatarUrl: null,
    bio: "Test account",
    countryCode: "",
    emailVerified: true,
    totalWatchMs: 0,
    longestSessionMs: 0,
    largestRoomSize: 0,
    dailyWatchMs: {},
    pushTokens: [],
    privacy: {
      watchHistory: "everyone",
      stats: "everyone",
      weeklyActivity: "everyone",
      friends: "everyone",
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ success: true, userId: docRef.id }, { status: 201 });
}
