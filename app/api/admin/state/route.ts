import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { appStateSchema } from "@/lib/state";
import { isStoreConfigured, saveState } from "@/lib/store";

export async function PUT(request: Request) {
  if (!await isAuthenticated()) return NextResponse.json({ error:"La sessió ha caducat. Torna a entrar." }, { status:401 });
  if (!isStoreConfigured()) return NextResponse.json({ error:"Falta connectar la base de dades (Upstash) a Vercel." }, { status:503 });
  const parsed = appStateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error:parsed.error.issues.map((issue) => issue.message).join(" · ") }, { status:400 });
  try {
    const saved = await saveState(parsed.data);
    revalidatePath("/");
    revalidatePath("/es");
    return NextResponse.json({ ok:true, state:saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error:"No s'ha pogut desar. Torna-ho a provar en uns minuts." }, { status:502 });
  }
}
