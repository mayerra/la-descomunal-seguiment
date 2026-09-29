import { buildContent } from "@/lib/state";
import { loadState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const { projects, indicators } = buildContent(await loadState(), "ca");
  return Response.json({ projects, indicators });
}
