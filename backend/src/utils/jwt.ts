import { createHmac, timingSafeEqual } from "node:crypto";

function secret(name: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function sign(userId: string, key: string, lifetimeSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ userId, iat: now, exp: now + lifetimeSeconds })).toString("base64url");
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac("sha256", key).update(unsignedToken).digest("base64url");
  return `${unsignedToken}.${signature}`;
}

export const generateAccessToken = (userId: string) => {
  return sign(userId, secret("JWT_ACCESS_SECRET"), 15 * 60);
};

export const generateRefreshToken = (userId: string) => {
  return sign(userId, secret("JWT_REFRESH_SECRET"), 7 * 24 * 60 * 60);
};

function verifyToken(token: string, key: string, label: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error(`Invalid ${label} token`);
  const [headerPart, payloadPart, signaturePart] = parts;
  let header: { alg?: string; typ?: string };
  let payload: { userId?: unknown; exp?: unknown };
  try {
    header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
  } catch {
    throw new Error(`Invalid ${label} token`);
  }
  if (header.alg !== "HS256" || header.typ !== "JWT") throw new Error(`Invalid ${label} token`);

  const expected = createHmac("sha256", key)
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  const actual = Buffer.from(signaturePart, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new Error(`Invalid ${label} token`);
  }

  if (typeof payload.userId !== "string" || typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error(`Invalid or expired ${label} token`);
  }
  return payload.userId;
}

export const verifyAccessToken = (token: string) =>
  verifyToken(token, secret("JWT_ACCESS_SECRET"), "access");

export const verifyRefreshToken = (token: string) =>
  verifyToken(token, secret("JWT_REFRESH_SECRET"), "refresh");
