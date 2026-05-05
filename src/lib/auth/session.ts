import { JWTPayload } from "@/src/types/auth/auth-types";
import { decrypt, encrypt } from "./jwt-strategie";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "token_session";

export async function createSessionCookie(
  user: Omit<JWTPayload, "iat" | "exp">,
) {
  const expiresAt = new Date(Date.now() * 2 * 60 * 60 * 1000);
  const token = await encrypt({
    sub: user.sub,
    email: user.email,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!session) return null;

  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
