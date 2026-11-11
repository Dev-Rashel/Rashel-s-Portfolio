import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "portfolio_admin_session";
export const SESSION_DURATION = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "admin" | "editor";
};

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be configured in production.");
    }
    console.warn("[auth] AUTH_SECRET is missing. Using an insecure development secret.");
    return new TextEncoder().encode("development-only-secret-change-before-deploying-32chars");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuer("portfolio-cms")
    .setAudience("admin")
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      issuer: "portfolio-cms",
      audience: "admin",
    });
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role === "editor" ? "editor" : "admin",
    };
  } catch {
    return null;
  }
}
