import { getDb } from "@/lib/firebase-admin";
import { validateAdminRequest, unauthorized } from "@/lib/admin-api";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await validateAdminRequest())) return unauthorized();

  const { userId } = await params;
  const { verified } = await request.json();
  const db = getDb();

  await db.collection("users").doc(userId).update({
    emailVerified: !!verified,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ success: true });
}
