import { z } from "zod";
import { indicators, projects, technicalTeam, upcomingEvents, type Indicator, type Project, type TeamEntity, type UpcomingEvent } from "@/lib/data";
import { activitiesEs, eventsEs, indicatorsEs, projectsEs, rolesEs } from "@/lib/data.es";
import { entityBudgets, type EntityBudget } from "@/lib/budget";
import { entityName, type Lang } from "@/lib/i18n";

// Dades que l'equip pot editar des de /admin. Els camps de text tenen una
// versió en català i una d'opcional en castellà (sufix Es); si la castellana
// és buida, la versió /es mostra el text en català.
// Els noms, resums i responsables dels projectes, l'equip i els mínims i
// òptims dels indicadors no s'editen des d'aquí: són a lib/data.ts.

const text = (max = 300) => z.string().trim().max(max);
const date = z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Data no vàlida");
const amount = z.number().finite().min(0).max(10_000_000).nullable();
const id = z.string().regex(/^[a-z0-9-]{1,40}$/i);

const activitySchema = z.object({
  id, date:text(80), dateEs:text(80), label:text(), labelEs:text(),
  status:z.enum(["fet", "en_curs", "previst", "pendent"]),
});

const projectSchema = z.object({
  id,
  status:z.enum(["pendent", "planificat", "en_curs", "bloquejat", "finalitzat"]),
  progress:z.number().int().min(0).max(100).nullable(),
  startDate:date, endDate:date,
  nextMilestone:text(), nextMilestoneEs:text(),
  activities:z.array(activitySchema).max(100),
});

const indicatorSchema = z.object({ id, actualValue:z.number().finite().min(0).max(1_000_000).nullable(), notes:text(1000), notesEs:text(1000) });

const eventSchema = z.object({ id, projectId:id, dateLabel:text(40), dateLabelEs:text(40), title:text(), titleEs:text(), date });

const amountsSchema = z.object({ nomines:amount, activitats:amount, executat:amount });
const budgetSchema = z.object({ entity:text(80), any1:amountsSchema, any2:amountsSchema });

export const appStateSchema = z.object({
  projects:z.array(projectSchema),
  indicators:z.array(indicatorSchema),
  events:z.array(eventSchema).max(100),
  budget:z.array(budgetSchema),
  updatedAt:z.string().optional(),
}).superRefine((state, ctx) => {
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((value) => b.includes(value));
  if (!same(state.projects.map((p) => p.id), projects.map((p) => p.id))) ctx.addIssue({ code:"custom", message:"Els projectes no coincideixen" });
  if (!same(state.indicators.map((i) => i.id), indicators.map((i) => i.id))) ctx.addIssue({ code:"custom", message:"Els indicadors no coincideixen" });
  if (!same(state.budget.map((b) => b.entity), entityBudgets.map((b) => b.entity))) ctx.addIssue({ code:"custom", message:"Les entitats del pressupost no coincideixen" });
  if (state.events.some((event) => !projects.some((p) => p.id === event.projectId))) ctx.addIssue({ code:"custom", message:"Hi ha un esdeveniment amb un projecte que no existeix" });
});

export type AppState = z.infer<typeof appStateSchema>;
export type ProjectState = AppState["projects"][number];
export type ActivityState = ProjectState["activities"][number];
export type IndicatorValues = AppState["indicators"][number];
export type EventState = AppState["events"][number];

// Punt de partida mentre no hi hagi res desat: les dades del codi.
export function defaultState(): AppState {
  return {
    projects:projects.map((p) => ({
      id:p.id, status:p.status, progress:p.progress, startDate:p.startDate, endDate:p.endDate,
      nextMilestone:p.nextMilestone, nextMilestoneEs:projectsEs[p.id]?.nextMilestone ?? "",
      activities:p.activities.map((a) => ({ id:a.id, date:a.date, dateEs:activitiesEs[a.id]?.date ?? "", label:a.label, labelEs:activitiesEs[a.id]?.label ?? "", status:a.status })),
    })),
    indicators:indicators.map((i) => ({ id:i.id, actualValue:i.actualValue, notes:i.notes, notesEs:indicatorsEs[i.id]?.notes ?? "" })),
    events:upcomingEvents.map((e) => ({ id:e.id, projectId:e.projectId, dateLabel:e.dateLabel, dateLabelEs:eventsEs[e.id]?.dateLabel ?? "", title:e.title, titleEs:eventsEs[e.id]?.title ?? "", date:e.date ?? "" })),
    budget:structuredClone(entityBudgets),
  };
}

export type Content = { projects: Project[]; indicators: Indicator[]; upcomingEvents: UpcomingEvent[]; technicalTeam: TeamEntity[]; budget: EntityBudget[] };

// Combina les dades fixes del codi amb les editables, en l'idioma demanat.
export function buildContent(state: AppState, lang: Lang): Content {
  const es = lang === "es";
  const pick = (ca: string, castellano: string) => es && castellano ? castellano : ca;
  return {
    projects:projects.map((base) => {
      const edit = state.projects.find((p) => p.id === base.id);
      const fixed = es ? { ...base, ...projectsEs[base.id] } : base;
      if (!edit) return fixed;
      return {
        ...fixed,
        status:edit.status, progress:edit.progress, startDate:edit.startDate, endDate:edit.endDate,
        nextMilestone:pick(edit.nextMilestone, edit.nextMilestoneEs),
        activities:edit.activities.map((a) => ({ id:a.id, date:pick(a.date, a.dateEs), label:pick(a.label, a.labelEs), status:a.status })),
      };
    }),
    indicators:indicators.map((base) => {
      const edit = state.indicators.find((i) => i.id === base.id);
      const fixed = es ? { ...base, ...indicatorsEs[base.id] } : base;
      return edit ? { ...fixed, actualValue:edit.actualValue, notes:pick(edit.notes, edit.notesEs) } : fixed;
    }),
    upcomingEvents:state.events.map((e) => ({ id:e.id, projectId:e.projectId, dateLabel:pick(e.dateLabel, e.dateLabelEs), title:pick(e.title, e.titleEs), date:e.date || undefined })),
    technicalTeam:technicalTeam.map((team) => ({
      entity:entityName(team.entity, lang),
      members:team.members.map((member) => ({ ...member, role:member.role && (es ? rolesEs[member.role] ?? member.role : member.role) })),
    })),
    budget:state.budget,
  };
}
