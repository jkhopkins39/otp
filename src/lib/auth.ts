import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Lightweight, self-hosted admin auth — no third-party service.
 *
 * - A single admin password lives in the `ADMIN_PASSWORD` env var (server-side).
 * - On a correct password we issue a signed, httpOnly session cookie.
 * - The cookie is an HMAC (keyed by `SESSION_SECRET`) over an expiry timestamp,
 *   so it cannot be forged or tampered with on the client.
 * - All write actions re-check `isAuthed()` on the server, so security does not
 *   depend on the UI hiding anything.
 */

const COOKIE_NAME = "otp_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  return process.env.SESSION_SECRET ?? "";
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Constant-time check of the submitted password against `ADMIN_PASSWORD`. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !getSessionSecret()) return false;
  return safeEqual(input, expected);
}

function createToken(): string {
  const exp = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token || !getSessionSecret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  const expiry = Number(exp);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(COOKIE_NAME)?.value);
}
