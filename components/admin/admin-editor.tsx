"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { indicators as indicatorDefs, projects as projectDefs, type ActivityStatus, type ProjectStatus } from "@/lib/data";
import { budgetYears, type BudgetAmounts, type BudgetYearId } from "@/lib/budget";
import { dictionaries } from "@/lib/i18n";
import type { ActivityState, AppState, EventState, IndicatorValues, ProjectState } from "@/lib/state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const labels = dictionaries.ca;
const projectStatuses = Object.keys(labels.statusLabels) as ProjectStatus[];
const activityStatuses = Object.keys(labels.activityLabels) as ActivityStatus[];
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;
const euros = (value: number) => new Intl.NumberFormat("ca-ES", { style:"currency", currency:"EUR", maximumFractionDigits:0 }).format(value);

function NumberField({ value, onChange, step = "1", min = 0, max, placeholder = "—" }: { value:number | null; onChange:(value:number | null)=>void; step?:string; min?:number; max?:number; placeholder?:string }) {
  return <input className="field numeric-field" type="number" inputMode="decimal" step={step} min={min} max={max} placeholder={placeholder} value={value ?? ""}
    onChange={(e) => { const next = e.target.value === "" ? null : Number(e.target.value); if (next === null || Number.isFinite(next)) onChange(next); }} />;
}

function TextPair({ label, ca, es, onChange, multiline = false }: { label:string; ca:string; es:string; onChange:(ca:string, es:string)=>void; multiline?:boolean }) {
  const Field = multiline ? "textarea" : "input";
  return <div className="text-pair">
    <label><span>{label} <em>català</em></span><Field className="field" value={ca} onChange={(e) => onChange(e.target.value, es)} /></label>
    <label><span>{label} <em>castellà · opcional</em></span><Field className="field" value={es} placeholder={ca} onChange={(e) => onChange(ca, e.target.value)} /></label>
  </div>;
}

export default function AdminEditor({ initialState, storeConfigured }: { initialState:AppState; storeConfigured:boolean }) {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [saved, setSaved] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind:"ok" | "error"; text:string } | null>(null);
  const dirty = JSON.stringify(state) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setMessage(null);
    const response = await fetch("/api/admin/state", { method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(state) });
    const body = await response.json().catch(() => null);
    setSaving(false);
    if (!response.ok) return setMessage({ kind:"error", text:body?.error ?? "No s'ha pogut desar" });
    setState(body.state);
    setSaved(body.state);
    setMessage({ kind:"ok", text:"Canvis desats. Ja es veuen al quadre." });
  }

  async function logout() {
    if (dirty && !confirm("Tens canvis sense desar. Vols sortir igualment?")) return;
    await fetch("/api/admin/logout", { method:"POST" });
    router.refresh();
  }

  const updateProject = (id: string, change: Partial<ProjectState>) => setState((s) => ({ ...s, projects:s.projects.map((p) => p.id === id ? { ...p, ...change } : p) }));
  const updateActivities = (id: string, update: (activities: ActivityState[]) => ActivityState[]) => setState((s) => ({ ...s, projects:s.projects.map((p) => p.id === id ? { ...p, activities:update(p.activities) } : p) }));
  const updateIndicator = (id: string, change: Partial<IndicatorValues>) => setState((s) => ({ ...s, indicators:s.indicators.map((i) => i.id === id ? { ...i, ...change } : i) }));
  const updateEvents = (update: (events: EventState[]) => EventState[]) => setState((s) => ({ ...s, events:update(s.events) }));
  const updateBudget = (entity: string, year: BudgetYearId, change: Partial<BudgetAmounts>) => setState((s) => ({ ...s, budget:s.budget.map((b) => b.entity === entity ? { ...b, [year]:{ ...b[year], ...change } } : b) }));
  const move = <T,>(list: T[], index: number, offset: number) => { const next = [...list]; const [item] = next.splice(index, 1); next.splice(index + offset, 0, item); return next; };

  return <main className="app-shell admin">
    <header className="topbar">
      <div className="brand-mark">LD</div>
      <div className="brand-copy"><strong>La Descomunal</strong><span>Administració del quadre</span></div>
      <nav className="admin-nav"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15}/>Veure el quadre</a><button type="button" onClick={logout}><LogOut size={15}/>Sortir</button></nav>
    </header>
    <div className="page-wrap">
      <section className="page-heading"><div><p className="eyebrow">Accés de l’equip</p><h1>Actualitzar dades</h1><p>Fes els canvis a cada pestanya i prem <strong>Desar canvis</strong>. Si el castellà es deixa buit, la versió en castellà mostra el text en català.</p></div></section>
      {!storeConfigured && <p className="admin-banner error">La base de dades encara no està connectada a Vercel: pots provar el formulari, però els canvis no es podran desar.</p>}
      <Tabs defaultValue="budget" className="workspace-tabs">
        <TabsList className="main-tabs">
          <TabsTrigger value="budget">Pressupost</TabsTrigger>
          <TabsTrigger value="projects">Projectes</TabsTrigger>
          <TabsTrigger value="indicators">Indicadors</TabsTrigger>
          <TabsTrigger value="events">Pròxims passos</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="tab-panel admin-stack">
          <p className="admin-help">Imports en euros. Deixa la casella buida si encara no tens la dada. A la web pública només es mostra el total per entitat; el detall de nòmines només surt sumat per a tot el programa.</p>
          <div className="admin-year-summary">{budgetYears.map((year) => {
            const assigned = state.budget.reduce((sum, b) => sum + (b[year.id].nomines ?? 0) + (b[year.id].activitats ?? 0), 0);
            return <div key={year.id} className={assigned > year.total ? "over" : undefined}><span>{year.label}</span><strong>{euros(assigned)} / {euros(year.total)}</strong><small>{assigned > year.total ? `Supera el pressupost en ${euros(assigned - year.total)}` : `Queden ${euros(year.total - assigned)} per assignar`}</small></div>;
          })}</div>
          {state.budget.map((line) => <section className="panel admin-card" key={line.entity}>
            <h2>{line.entity}</h2>
            <table className="admin-table"><thead><tr><th/><th>Nòmines</th><th>Activitats</th><th>Executat</th></tr></thead><tbody>
              {budgetYears.map((year) => <tr key={year.id}><th>{year.label.split(" · ")[0]}</th>
                <td><NumberField step="0.01" value={line[year.id].nomines} onChange={(nomines) => updateBudget(line.entity, year.id, { nomines })}/></td>
                <td><NumberField step="0.01" value={line[year.id].activitats} onChange={(activitats) => updateBudget(line.entity, year.id, { activitats })}/></td>
                <td><NumberField step="0.01" value={line[year.id].executat} onChange={(executat) => updateBudget(line.entity, year.id, { executat })}/></td>
              </tr>)}
            </tbody></table>
          </section>)}
        </TabsContent>

        <TabsContent value="projects" className="tab-panel admin-stack">
          {state.projects.map((project) => { const def = projectDefs.find((p) => p.id === project.id)!; return <details className="panel admin-card" key={project.id}>
            <summary><span className="project-number">{def.number}</span><strong>{def.shortName}</strong><span className={`status-pill status-${project.status}`}><span/>{labels.statusLabels[project.status]}</span><em>{project.progress === null ? "—" : `${project.progress}%`}</em></summary>
            <div className="admin-grid">
              <label><span>Estat</span><select className="field" value={project.status} onChange={(e) => updateProject(project.id, { status:e.target.value as ProjectStatus })}>{projectStatuses.map((s) => <option key={s} value={s}>{labels.statusLabels[s]}</option>)}</select></label>
              <label><span>Avanç (%)</span><NumberField max={100} value={project.progress} onChange={(progress) => updateProject(project.id, { progress:progress === null ? null : Math.min(100, Math.round(progress)) })}/></label>
              <label><span>Data d’inici</span><input className="field" type="date" value={project.startDate} onChange={(e) => updateProject(project.id, { startDate:e.target.value })}/></label>
              <label><span>Data de finalització</span><input className="field" type="date" value={project.endDate} onChange={(e) => updateProject(project.id, { endDate:e.target.value })}/></label>
            </div>
            <TextPair label="Pròxima fita" ca={project.nextMilestone} es={project.nextMilestoneEs} onChange={(nextMilestone, nextMilestoneEs) => updateProject(project.id, { nextMilestone, nextMilestoneEs })}/>
            <h3>Activitats</h3>
            {project.activities.map((activity, index) => { const set = (change: Partial<ActivityState>) => updateActivities(project.id, (list) => list.map((a) => a.id === activity.id ? { ...a, ...change } : a)); return <div className="admin-row" key={activity.id}>
              <TextPair label="Data" ca={activity.date} es={activity.dateEs} onChange={(date, dateEs) => set({ date, dateEs })}/>
              <TextPair label="Activitat" ca={activity.label} es={activity.labelEs} onChange={(label, labelEs) => set({ label, labelEs })}/>
              <div className="row-actions">
                <select className="field" value={activity.status} onChange={(e) => set({ status:e.target.value as ActivityStatus })}>{activityStatuses.map((s) => <option key={s} value={s}>{labels.activityLabels[s]}</option>)}</select>
                <button type="button" className="icon-button" aria-label="Pujar" disabled={index === 0} onClick={() => updateActivities(project.id, (list) => move(list, index, -1))}><ArrowUp size={15}/></button>
                <button type="button" className="icon-button" aria-label="Baixar" disabled={index === project.activities.length - 1} onClick={() => updateActivities(project.id, (list) => move(list, index, 1))}><ArrowDown size={15}/></button>
                <button type="button" className="icon-button danger" aria-label="Eliminar activitat" onClick={() => confirm("Vols eliminar aquesta activitat?") && updateActivities(project.id, (list) => list.filter((a) => a.id !== activity.id))}><Trash2 size={15}/></button>
              </div>
            </div>; })}
            <button type="button" className="secondary-button" onClick={() => updateActivities(project.id, (list) => [...list, { id:newId(project.id), date:"", dateEs:"", label:"", labelEs:"", status:"previst" }])}><Plus size={15}/>Afegir activitat</button>
          </details>; })}
        </TabsContent>

        <TabsContent value="indicators" className="tab-panel admin-stack">
          {projectDefs.map((def) => <section className="panel admin-card" key={def.id}>
            <h2>P{def.number} · {def.shortName}</h2>
            {state.indicators.filter((i) => indicatorDefs.find((d) => d.id === i.id)?.projectId === def.id).map((indicator) => { const d = indicatorDefs.find((x) => x.id === indicator.id)!; return <div className="admin-row" key={indicator.id}>
              <div className="indicator-edit-head"><strong>{d.label}</strong><small>Mínim {d.minimum}{d.unit === "%" ? "%" : ""} · Òptim {d.optimum}{d.unit === "%" ? "%" : ""} · {d.source}</small></div>
              <label className="indicator-value"><span>Resultat actual{d.unit === "%" ? " (%)" : ""}</span>{d.unit === "estat"
                ? <select className="field" value={indicator.actualValue === null ? "" : String(indicator.actualValue)} onChange={(e) => updateIndicator(indicator.id, { actualValue:e.target.value === "" ? null : Number(e.target.value) })}><option value="">Pendent de mesurar</option><option value="0">No assolit</option><option value="1">Assolit</option></select>
                : <NumberField step="0.1" value={indicator.actualValue} onChange={(actualValue) => updateIndicator(indicator.id, { actualValue })}/>}</label>
              <TextPair multiline label="Observacions" ca={indicator.notes} es={indicator.notesEs} onChange={(notes, notesEs) => updateIndicator(indicator.id, { notes, notesEs })}/>
            </div>; })}
          </section>)}
        </TabsContent>

        <TabsContent value="events" className="tab-panel admin-stack">
          <p className="admin-help">Apareixen a “Pròxims passos” en aquest ordre. Si poses la data exacta, també surten com a fita al cronograma.</p>
          <section className="panel admin-card">
            {state.events.map((event, index) => { const set = (change: Partial<EventState>) => updateEvents((list) => list.map((e) => e.id === event.id ? { ...e, ...change } : e)); return <div className="admin-row" key={event.id}>
              <div className="admin-grid">
                <label><span>Projecte</span><select className="field" value={event.projectId} onChange={(e) => set({ projectId:e.target.value })}>{projectDefs.map((p) => <option key={p.id} value={p.id}>{p.number}. {p.shortName}</option>)}</select></label>
                <label><span>Data exacta (opcional)</span><input className="field" type="date" value={event.date} onChange={(e) => set({ date:e.target.value })}/></label>
              </div>
              <TextPair label="Data curta (ex. 7 OCT)" ca={event.dateLabel} es={event.dateLabelEs} onChange={(dateLabel, dateLabelEs) => set({ dateLabel, dateLabelEs })}/>
              <TextPair label="Títol" ca={event.title} es={event.titleEs} onChange={(title, titleEs) => set({ title, titleEs })}/>
              <div className="row-actions">
                <button type="button" className="icon-button" aria-label="Pujar" disabled={index === 0} onClick={() => updateEvents((list) => move(list, index, -1))}><ArrowUp size={15}/></button>
                <button type="button" className="icon-button" aria-label="Baixar" disabled={index === state.events.length - 1} onClick={() => updateEvents((list) => move(list, index, 1))}><ArrowDown size={15}/></button>
                <button type="button" className="icon-button danger" aria-label="Eliminar" onClick={() => confirm("Vols eliminar aquest pas?") && updateEvents((list) => list.filter((e) => e.id !== event.id))}><Trash2 size={15}/></button>
              </div>
            </div>; })}
            <button type="button" className="secondary-button" onClick={() => updateEvents((list) => [...list, { id:newId("e"), projectId:projectDefs[0].id, dateLabel:"", dateLabelEs:"", title:"", titleEs:"", date:"" }])}><Plus size={15}/>Afegir pas</button>
          </section>
        </TabsContent>
      </Tabs>
    </div>
    <div className={`save-bar ${dirty ? "dirty" : ""}`}>
      <span>{message ? <span className={message.kind === "error" ? "form-error" : "form-ok"}>{message.text}</span> : dirty ? "Tens canvis sense desar" : "Tot desat"}</span>
      <div>{dirty && <button type="button" className="secondary-button" onClick={() => { setState(saved); setMessage(null); }}>Desfer</button>}
        <button type="button" className="primary-button" disabled={!dirty || saving || !storeConfigured} onClick={save}><Save size={15}/>{saving ? "Desant…" : "Desar canvis"}</button></div>
    </div>
  </main>;
}
