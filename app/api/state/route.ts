import { indicators, projects } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({ projects, indicators });
}

export async function POST(request: Request) {
  // Vercel deployment without an external database: the client keeps edits
  // locally, while this endpoint remains compatible with the dashboard UI.
  await request.json().catch(() => null);
  return Response.json({ ok: true });
}
