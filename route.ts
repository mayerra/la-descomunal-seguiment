import { getDb } from "../../../db";
import { indicatorUpdates, projectUpdates } from "../../../db/schema";
import { indicators, projects } from "../../data";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "No s'ha pogut completar l'operació";
  return Response.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    const db = getDb();
    const [savedProjects, savedIndicators] = await Promise.all([
      db.select().from(projectUpdates),
      db.select().from(indicatorUpdates),
    ]);
    const projectMap = new Map(savedProjects.map((row) => [row.projectId, row]));
    const indicatorMap = new Map(savedIndicators.map((row) => [row.indicatorId, row]));

    return Response.json({
      projects: projects.map((project) => ({ ...project, ...projectMap.get(project.id) })),
      indicators: indicators.map((indicator) => ({ ...indicator, ...indicatorMap.get(indicator.id) })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const db = getDb();
    const now = new Date().toISOString();

    if (payload.type === "project") {
      const projectId = String(payload.projectId ?? "");
      if (!projects.some((project) => project.id === projectId)) {
        return Response.json({ error: "Projecte no vàlid" }, { status: 400 });
      }
      const status = String(payload.status ?? "pendent");
      const progress = Math.max(0, Math.min(100, Number(payload.progress ?? 0)));
      const values = {
        projectId,
        status,
        progress,
        startDate: String(payload.startDate ?? "") || null,
        endDate: String(payload.endDate ?? "") || null,
        nextMilestone: String(payload.nextMilestone ?? ""),
        updatedAt: now,
      };
      await db.insert(projectUpdates).values(values).onConflictDoUpdate({ target: projectUpdates.projectId, set: values });
      return Response.json({ ok: true, project: values });
    }

    if (payload.type === "indicator") {
      const indicatorId = String(payload.indicatorId ?? "");
      if (!indicators.some((indicator) => indicator.id === indicatorId)) {
        return Response.json({ error: "Indicador no vàlid" }, { status: 400 });
      }
      const raw = payload.actualValue;
      const actualValue = raw === "" || raw === null || raw === undefined ? null : Number(raw);
      if (actualValue !== null && (!Number.isFinite(actualValue) || actualValue < 0)) {
        return Response.json({ error: "El valor ha de ser un nombre positiu" }, { status: 400 });
      }
      const values = { indicatorId, actualValue, notes: String(payload.notes ?? ""), updatedAt: now };
      await db.insert(indicatorUpdates).values(values).onConflictDoUpdate({ target: indicatorUpdates.indicatorId, set: values });
      return Response.json({ ok: true, indicator: values });
    }

    return Response.json({ error: "Tipus d'actualització no vàlid" }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
