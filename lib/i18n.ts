import type { ActivityStatus, ProjectStatus } from "@/lib/data";
import { entityNamesEs } from "@/lib/data.es";

export function entityName(entity: string, lang: Lang) {
  return lang === "es" ? entityNamesEs[entity] ?? entity : entity;
}

export type Lang = "ca" | "es";

const ca = {
  locale: "ca-ES",
  path: "/",
  appSubtitle: "Seguiment 2026–2028",
  liveData: "Dades de seguiment",
  updated: (d: string) => `Actualitzat el ${d}`,
  teamAccess: "Accés de l’equip",
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
  team: { title: "Equip tècnic i Comitè Activador", subtitle: (n: number) => `${n} professionals de les cinc entitats responsables`, count: "5 entitats", entityLabel: "Entitat del Comitè Activador" },
  progressPanel: { title: "Avanç per projecte", subtitle: "Clica un projecte per veure’n el detall" },
  nextPanel: { title: "Pròxims passos", subtitle: "Fites que cal tenir presents" },
  projectsTab: { title: "Els nou projectes", subtitle: "Responsables, estat, progrés i pròxima fita.", owner: "Responsable", activities: (n: number) => `${n} activitats registrades`, noActivities: "Sense activitats registrades", progress: "Avanç", pendingProgress: "Pendent de calcular", detail: "Veure detall" },
  gantt: { title: "Cronograma general", subtitle: "Planificació · febrer 2026 — febrer 2028", legend: "Durada prevista", project: "Projecte", pending: "Pendent", noDates: "Sense dates planificades" },
  indicatorsTab: { title: "Indicadors d’assoliment", subtitle: "Comparació entre el resultat actual, el mínim i l’òptim.", all: "Tots els projectes", column: "Projecte i indicador", actual: "Actual", minimum: "Mínim", optimum: "Òptim", state: "Estat", achieved: "Assolit", notAchieved: "No assolit", states: { optim: "Òptim", minim: "Mínim assolit", risc: "En risc", pendent: "Pendent" } },
  budgetTab: { title: "Pressupost", subtitle: "Repartiment per entitat i execució · febrer 2026 — febrer 2028", total: "Pressupost total", totalNote: (v: string) => `${v} per any`, assigned: "Assignat a entitats", assignedNote: (v: string) => `Pendent d’assignar: ${v}`, executed: "Executat", executedNote: "Despesa executada fins ara", execution: "Execució", executionNote: "Executat sobre el pressupost total", conceptTitle: "On va el pressupost", conceptSubtitle: "Nòmines i activitats, sumat per a tot el programa", staff: "Nòmines", activities: "Activitats", pendingNote: "Les dades pressupostàries estan pendents d’incorporar.", pending: "Pendent", entity: "Entitat", totalColumn: "Total", totalRow: "Total", overBudget: (v: string) => `L’import assignat supera el pressupost de l’any en ${v}.`, yearAssigned: "Assignat", yearExecuted: "Executat", hideAmounts: "Amagar imports", showAmounts: "Mostrar imports" },
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
  updated: (d: string) => `Actualizado el ${d}`,
  teamAccess: "Acceso del equipo",
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
  team: { title: "Equipo técnico y Comité Activador", subtitle: (n: number) => `${n} profesionales de las cinco entidades responsables`, count: "5 entidades", entityLabel: "Entidad del Comité Activador" },
  progressPanel: { title: "Avance por proyecto", subtitle: "Haz clic en un proyecto para ver el detalle" },
  nextPanel: { title: "Próximos pasos", subtitle: "Hitos a tener presentes" },
  projectsTab: { title: "Los nueve proyectos", subtitle: "Responsables, estado, progreso y próximo hito.", owner: "Responsable", activities: (n: number) => `${n} actividades registradas`, noActivities: "Sin actividades registradas", progress: "Avance", pendingProgress: "Pendiente de calcular", detail: "Ver detalle" },
  gantt: { title: "Cronograma general", subtitle: "Planificación · febrero 2026 — febrero 2028", legend: "Duración prevista", project: "Proyecto", pending: "Pendiente", noDates: "Sin fechas planificadas" },
  indicatorsTab: { title: "Indicadores de logro", subtitle: "Comparación entre el resultado actual, el mínimo y el óptimo.", all: "Todos los proyectos", column: "Proyecto e indicador", actual: "Actual", minimum: "Mínimo", optimum: "Óptimo", state: "Estado", achieved: "Logrado", notAchieved: "No logrado", states: { optim: "Óptimo", minim: "Mínimo alcanzado", risc: "En riesgo", pendent: "Pendiente" } },
  budgetTab: { title: "Presupuesto", subtitle: "Reparto por entidad y ejecución · febrero 2026 — febrero 2028", total: "Presupuesto total", totalNote: (v: string) => `${v} por año`, assigned: "Asignado a entidades", assignedNote: (v: string) => `Pendiente de asignar: ${v}`, executed: "Ejecutado", executedNote: "Gasto ejecutado hasta ahora", execution: "Ejecución", executionNote: "Ejecutado sobre el presupuesto total", conceptTitle: "A dónde va el presupuesto", conceptSubtitle: "Nóminas y actividades, sumado para todo el programa", staff: "Nóminas", activities: "Actividades", pendingNote: "Los datos presupuestarios están pendientes de incorporar.", pending: "Pendiente", entity: "Entidad", totalColumn: "Total", totalRow: "Total", overBudget: (v: string) => `El importe asignado supera el presupuesto del año en ${v}.`, yearAssigned: "Asignado", yearExecuted: "Ejecutado", hideAmounts: "Ocultar importes", showAmounts: "Mostrar importes" },
  sheet: { title: "Detalle del proyecto", description: "Información actualizada por el equipo técnico.", project: "Proyecto", state: "Estado", progress: "Avance", start: "Inicio", end: "Finalización", owner: "Responsable", next: "Próximo hito", activities: "Actividades registradas", noActivities: "Todavía no hay actividades registradas.", pending: "Pendiente" },
  statusLabels: { pendent: "Pendiente", planificat: "Planificado", en_curs: "En curso", bloquejat: "Bloqueado", finalitzat: "Finalizado" },
  activityLabels: { fet: "Hecho", en_curs: "En curso", previst: "Previsto", pendent: "Pendiente" },
  footer: "Creado y diseñado por Magdalena Ayerra",
};

export const dictionaries: Record<Lang, Dictionary> = { ca, es };
