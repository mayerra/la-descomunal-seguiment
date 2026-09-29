import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Accés a /admin amb una contrasenya compartida (variable ADMIN_PASSWORD a
// Vercel). La sessió és una galeta signada que caduca als 7 dies; si es
// canvia la contrasenya, totes les sessions obertes deixen de ser vàlides.

export const SESSION_COOKIE = "ld_admin";
const SESSION_DAYS = 7;

function password() {
  return process.env.ADMIN_PASSWORD || null;
}

export function isAuthConfigured() {
  return password() !== null;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

export function checkPassword(candidate: string) {
  const expected = password();
  return expected !== null && timingSafeEqual(digest(candidate), digest(expected));
}

function sign(value: string) {
  return createHmac("sha256", `ld-session:${password()}`).update(value).digest("base64url");
}

export function createSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { value:`${expires}.${sign(String(expires))}`, expires:new Date(expires) };
}

export async function isAuthenticated() {
  if (!isAuthConfigured()) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const [expires, signature] = token?.split(".") ?? [];
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = sign(expires);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
