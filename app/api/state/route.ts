import { indicators, projects } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({ projects, indicators });
}
