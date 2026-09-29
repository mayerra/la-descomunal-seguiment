import { projects, indicators, upcomingEvents, technicalTeam, type ActivityStatus, type Indicator, type Project, type ProjectStatus, type TeamEntity, type UpcomingEvent } from "@/lib/data";
import { projectsEs, activitiesEs, eventsEs, indicatorsEs, entityNamesEs, rolesEs } from "@/lib/data.es";

export type Lang = "ca" | "es";

const ca = {
  locale: "ca-ES",
  path: "/",
  appSubtitle: "Seguiment 2026–2028",
  liveData: "Dades de seguiment",
  eyebrow: "Comunalitat Urbana Zona 09",
  title: "Quadre de seguiment",
  intro: "Visió compartida dels nou projectes, el cronograma, els indicadors d’assoliment i el pressupost.",
  period: "Febrer 2026 — Febrer 2028",
  tabs: { dashboard: "Resum", projects: "Projectes", gantt: "Cronograma", indicators: "Indicadors", budget: "Pressupost" },
  metrics: {
    active: "Projectes actius", activeNote: "Projectes actualment en curs",
    progress: "Avanç global", progressNote: "Estimació actual del programa",
    measured: "Indicadors mesurats", measuredNote: (n: number) => `${n} compleixen el mínim`,
    alerts: "Alertes", blocked: "Projectes bloquejats", noBlocked: "Cap projecte bloquejat",
  },
  pulse: { title: "Pols del programa", subtitle: "Lectura ràpida de l’avanç global", completed: "completat", kicker: "AVANÇ DEL PROGRAMA", headline: "El programa ja està en marxa", text: (p: number) => `El ${p}% reflecteix el treball activat durant els primers mesos del període.`, start: "Feb. 2026", end: "Feb. 2028" },
  statusChart: { title: "Estat dels projectes", subtitle: "Distribució actual dels nou projectes", series: "Projectes", labels: { en_curs: "En curs", planificat: "Planificats", pendent: "Pendents", bloquejat: "Bloquejats", finalitzat: "Finalitzats" } as Record<ProjectStatus, string> },
  team: { title: "Equip tècnic i Comitè Activador", subtitle: "Set professionals de les cinc entitats responsables", count: "5 entitats", entityLabel: "Entitat del Comitè Activador" },
  progressPanel: { title: "Avanç per projecte", subtitle: "Clica un projecte per veure’n el detall" },
  nextPanel: { title: "Pròxims passos", subtitle: "Fites que cal tenir presents" },
  projectsTab: { title: "Els nou projectes", subtitle: "Responsables, estat, progrés i pròxima fita.", owner: "Responsable", activities: (n: number) => `${n} activitats registrades`, noActivities: "Sense activitats registrades", progress: "Avanç", pendingProgress: "Pendent de calcular", detail: "Veure detall" },
  gantt: { title: "Cronograma general", subtitle: "Planificació · febrer 2026 — febrer 2028", legend: "Durada prevista", project: "Projecte", pending: "Pendent", noDates: "Sense dates planificades" },
  indicatorsTab: { title: "Indicadors d’assoliment", subtitle: "Comparació entre el resultat actual, el mínim i l’òptim.", all: "Tots els projectes", column: "Projecte i indicador", actual: "Actual", minimum: "Mínim", optimum: "Òptim", state: "Estat", achieved: "Assolit", notAchieved: "No assolit", states: { optim: "Òptim", minim: "Mínim assolit", risc: "En risc", pendent: "Pendent" } },
  budgetTab: { title: "Pressupost", subtitle: "Execució pressupostària per projecte · 2026–2028", total: "Pressupost total", totalNote: "Suma dels nou projectes", executed: "Executat", executedNote: "Despesa executada fins ara", execution: "Execució", executionNote: "Executat sobre pressupostat", pendingNote: "Les dades pressupostàries estan pendents d’incorporar.", pending: "Pendent", project: "Projecte", allocated: "Pressupost", totalRow: "Total" },
  sheet: { title: "Detall del projecte", description: "Informació actualitzada per l’equip tècnic.", project: "Projecte", state: "Estat", progress: "Avanç", start: "Inici", end: "Finalització", owner: "Responsable", next: "Pròxima fita", activities: "Activitats registrades", noActivities: "Encara no hi ha activitats registrades.", pending: "Pendent" },
  statusLabels: { pendent: "Pendent", planificat: "Planificat", en_curs: "En curs", bloquejat: "Bloquejat", finalitzat: "Finalitzat" } as Record<ProjectStatus, string>,
  activityLabels: { fet: "Fet", en_curs: "En curs", previst: "Previst", pendent: "Pendent" } as Record<ActivityStatus, string>,
  footer: "Creat i dissenyat per Magdalena Ayerra",
};

export type Dictionary = typeof ca;

const es: Dictionary = {
  locale: "es-ES",
  path: "/es",
  appSubtitle: "Seguimiento 2026–2028",
  liveData: "Datos de seguimiento",
  eyebrow: "Comunalitat Urbana Zona 09",
  title: "Cuadro de seguimiento",
  intro: "Visión compartida de los nueve proyectos, el cronograma, los indicadores de logro y el presupuesto.",
  period: "Febrero 2026 — Febrero 2028",
  tabs: { dashboard: "Resumen", projects: "Proyectos", gantt: "Cronograma", indicators: "Indicadores", budget: "Presupuesto" },
  metrics: {
    active: "Proyectos activos", activeNote: "Proyectos actualmente en curso",
    progress: "Avance global", progressNote: "Estimación actual del programa",
    measured: "Indicadores medidos", measuredNote: (n: number) => `${n} cumplen el mínimo`,
    alerts: "Alertas", blocked: "Proyectos bloqueados", noBlocked: "Ningún proyecto bloqueado",
  },
  pulse: { title: "Pulso del programa", subtitle: "Lectura rápida del avance global", completed: "completado", kicker: "AVANCE DEL PROGRAMA", headline: "El programa ya está en marcha", text: (p: number) => `El ${p}% refleja el trabajo activado durante los primeros meses del periodo.`, start: "Feb. 2026", end: "Feb. 2028" },
  statusChart: { title: "Estado de los proyectos", subtitle: "Distribución actual de los nueve proyectos", series: "Proyectos", labels: { en_curs: "En curso", planificat: "Planificados", pendent: "Pendientes", bloquejat: "Bloqueados", finalitzat: "Finalizados" } },
  team: { title: "Equipo técnico y Comité Activador", subtitle: "Siete profesionales de las cinco entidades responsables", count: "5 entidades", entityLabel: "Entidad del Comité Activador" },
  progressPanel: { title: "Avance por proyecto", subtitle: "Haz clic en un proyecto para ver el detalle" },
  nextPanel: { title: "Próximos pasos", subtitle: "Hitos a tener presentes" },
  projectsTab: { title: "Los nueve proyectos", subtitle: "Responsables, estado, progreso y próximo hito.", owner: "Responsable", activities: (n: number) => `${n} actividades registradas`, noActivities: "Sin actividades registradas", progress: "Avance", pendingProgress: "Pendiente de calcular", detail: "Ver detalle" },
  gantt: { title: "Cronograma general", subtitle: "Planificación · febrero 2026 — febrero 2028", legend: "Duración prevista", project: "Proyecto", pending: "Pendiente", noDates: "Sin fechas planificadas" },
  indicatorsTab: { title: "Indicadores de logro", subtitle: "Comparación entre el resultado actual, el mínimo y el óptimo.", all: "Todos los proyectos", column: "Proyecto e indicador", actual: "Actual", minimum: "Mínimo", optimum: "Óptimo", state: "Estado", achieved: "Logrado", notAchieved: "No logrado", states: { optim: "Óptimo", minim: "Mínimo alcanzado", risc: "En riesgo", pendent: "Pendiente" } },
  budgetTab: { title: "Presupuesto", subtitle: "Ejecución presupuestaria por proyecto · 2026–2028", total: "Presupuesto total", totalNote: "Suma de los nueve proyectos", executed: "Ejecutado", executedNote: "Gasto ejecutado hasta ahora", execution: "Ejecución", executionNote: "Ejecutado sobre presupuestado", pendingNote: "Los datos presupuestarios están pendientes de incorporar.", pending: "Pendiente", project: "Proyecto", allocated: "Presupuesto", totalRow: "Total" },
  sheet: { title: "Detalle del proyecto", description: "Información actualizada por el equipo técnico.", project: "Proyecto", state: "Estado", progress: "Avance", start: "Inicio", end: "Finalización", owner: "Responsable", next: "Próximo hito", activities: "Actividades registradas", noActivities: "Todavía no hay actividades registradas.", pending: "Pendiente" },
  statusLabels: { pendent: "Pendiente", planificat: "Planificado", en_curs: "En curso", bloquejat: "Bloqueado", finalitzat: "Finalizado" },
  activityLabels: { fet: "Hecho", en_curs: "En curso", previst: "Previsto", pendent: "Pendiente" },
  footer: "Creado y diseñado por Magdalena Ayerra",
};

export const dictionaries: Record<Lang, Dictionary> = { ca, es };

// Les dades es mantenen en català a lib/data.ts; la traducció castellana
// (lib/data.es.ts) només sobreescriu els textos i, si en falta algun, es
// mostra l'original.
export function getContent(lang: Lang): { projects: Project[]; indicators: Indicator[]; upcomingEvents: UpcomingEvent[]; technicalTeam: TeamEntity[] } {
  if (lang === "ca") return { projects, indicators, upcomingEvents, technicalTeam };
  return {
    projects: projects.map((project) => ({
      ...project,
      ...projectsEs[project.id],
      activities: project.activities.map((activity) => ({ ...activity, ...activitiesEs[activity.id] })),
    })),
    indicators: indicators.map((indicator) => ({ ...indicator, ...indicatorsEs[indicator.id] })),
    upcomingEvents: upcomingEvents.map((event) => ({ ...event, ...eventsEs[event.id] })),
    technicalTeam: technicalTeam.map((team) => ({
      entity: entityNamesEs[team.entity] ?? team.entity,
      members: team.members.map((member) => ({ ...member, role: member.role && (rolesEs[member.role] ?? member.role) })),
    })),
  };
}
