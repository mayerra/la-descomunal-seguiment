import { appStateSchema, defaultState, type AppState } from "@/lib/state";

// Desa les dades editables a Upstash Redis (Vercel → Storage → Upstash).
// Sense base de dades configurada, la web mostra les dades del codi.

const KEY = "descomunal:state";
const HISTORY_KEY = "descomunal:history";
const HISTORY_SIZE = 50;

function credentials() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function isStoreConfigured() {
  return credentials() !== null;
}

async function redis(command: (string | number)[]) {
  const creds = credentials();
  if (!creds) throw new Error("La base de dades no està configurada");
  const response = await fetch(creds.url, {
    method:"POST",
    headers:{ Authorization:`Bearer ${creds.token}`, "Content-Type":"application/json" },
    body:JSON.stringify(command),
    cache:"no-store",
  });
  const body = await response.json().catch(() => null) as { result?: unknown; error?: string } | null;
  if (!response.ok || !body || body.error) throw new Error(body?.error ?? `Error de la base de dades (${response.status})`);
  return body.result;
}

export async function loadState(): Promise<AppState> {
  if (!isStoreConfigured()) return defaultState();
  try {
    const raw = await redis(["GET", KEY]);
    if (typeof raw !== "string") return defaultState();
    const parsed = appStateSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
    console.error("Dades desades no vàlides; es mostren les del codi", parsed.error.issues);
  } catch (error) {
    console.error("No s'han pogut llegir les dades desades", error);
  }
  return defaultState();
}

export async function saveState(state: AppState): Promise<AppState> {
  const saved = { ...state, updatedAt:new Date().toISOString() };
  const previous = await redis(["GET", KEY]);
  if (typeof previous === "string") {
    await redis(["LPUSH", HISTORY_KEY, previous]);
    await redis(["LTRIM", HISTORY_KEY, 0, HISTORY_SIZE - 1]);
  }
  await redis(["SET", KEY, JSON.stringify(saved)]);
  return saved;
}
