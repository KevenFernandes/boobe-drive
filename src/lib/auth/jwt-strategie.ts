import { JWTPayload } from "@/src/types/auth-types";
import { jwtVerify, SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET_KEY);
}

export async function decrypt(token: string): Promise<JWTPayload | null> {
  try {
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      token,
      SECRET_KEY,
      {
        algorithms: ["HS256"],
      },
    );
    return payload;
  } catch {
    return null;
  }
}
