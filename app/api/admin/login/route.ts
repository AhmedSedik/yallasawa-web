import { cookies } from "next/headers";
import {
  validateCredentials,
  createAdminToken,
  COOKIE_NAME,
  SESSION_DURATION,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return Response.json({ error: "Missing credentials" }, { status: 400 });
  }

  if (!validateCredentials(username, password)) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminToken();
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  return Response.json({ success: true });
}
