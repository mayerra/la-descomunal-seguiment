import { NextResponse } from "next/server";
import { checkPassword, createSession, isAuthConfigured, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  if (!isAuthConfigured()) return NextResponse.json({ error:"Falta configurar la contrasenya (ADMIN_PASSWORD) a Vercel." }, { status:503 });
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !checkPassword(body.password)) {
    // Frena els intents repetits d'endevinar la contrasenya.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ error:"Contrasenya incorrecta" }, { status:401 });
  }
  const session = createSession();
  const response = NextResponse.json({ ok:true });
  response.cookies.set(SESSION_COOKIE, session.value, { httpOnly:true, secure:process.env.NODE_ENV === "production", sameSite:"strict", path:"/", expires:session.expires });
  return response;
}
