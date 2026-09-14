"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, CalendarRange, CheckCircle2, ChevronRight, CircleGauge, Clock3, FolderKanban, LayoutDashboard, Pencil, Target } from "lucide-react";
import { projects as initialProjects, indicators as initialIndicators, upcomingEvents, Project, Indicator, ProjectStatus, ActivityStatus, statusLabels } from "./data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

type Editing = { kind:"project"; item:Project } | { kind:"indicator"; item:Indicator } | null;
const statuses: ProjectStatus[] = ["pendent", "planificat", "en_curs", "bloquejat", "finalitzat"];
const LOCAL_STATE_KEY = "la-descomunal-seguiment-state-v1";

function saveLocalState(projects: Project[], indicators: Indicator[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify({ projects, indicators }));
  }
}

function indicatorState(indicator: Indicator) {
  if (indicator.actualValue === null) return "pendent";
  if (indicator.actualValue >= indicator.optimum) return "optim";
  if (indicator.actualValue >= indicator.minimum) return "minim";
  return "risc";
}

function formatIndicator(value: number | null, unit: Indicator["unit"]) {
  if (value === null) return "—";
  if (unit === "%") return `${value}%`;
  if (unit === "estat") return value >= 1 ? "Assolit" : "No assolit";
  return String(value);
}

function ProjectPill({ status }: { status: ProjectStatus }) {
  return <span className={`status-pill status-${status}`}><span />{statusLabels[status]}</span>;
}

const activityLabels: Record<ActivityStatus, string> = { fet:"Fet", en_curs:"En curs", previst:"Previst", pendent:"Pendent" };
const technicalTeam = [
  { entity:"RECOOP", names:["Anna Maria Doladé", "Laura Matias"] },
  { entity:"Ajuntament de Lleida", names:["Cristina Saiz"] },
  { entity:"Fundació Champagnat", names:["Lali Ayerra", "Cristina Balsells"] },
  { entity:"UE Gardeny", names:["Mireia Queralt"] },
  { entity:"Associació La Nou", names:["Júlia Pallarés"] },
];

export default function Home() {
  const [projects, setProjects] = useState(initialProjects);
  const [indicators, setIndicators] = useState(initialIndicators);
  const [editing, setEditing] = useState<Editing>(null);
  const [indicatorFilter, setIndicatorFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/state", { cache:"no-store" })
      .then(async (response) => { if (!response.ok) throw new Error("state unavailable"); return response.json(); })
      .then((data) => {
        try {
          const local = JSON.parse(window.localStorage.getItem(LOCAL_STATE_KEY) || "null");
          setProjects(local?.projects ?? data.projects);
          setIndicators(local?.indicators ?? data.indicators);
        } catch {
          setProjects(data.projects);
          setIndicators(data.indicators);
        }
      })
      .catch(() => toast.warning("S'ha carregat la planificació inicial. Els canvis es podran desar quan el servei estigui disponible."))
      .finally(() => setLoading(false));
  }, []);

  const globalProgress = 30;
  const activeProjects = projects.filter((p) => p.status === "en_curs").length;
  const blockedProjects = projects.filter((p) => p.status === "bloquejat").length;
  const measured = indicators.filter((i) => i.actualValue !== null);
  const achieved = measured.filter((i) => ["minim", "optim"].includes(indicatorState(i))).length;
  const filteredIndicators = indicatorFilter === "all" ? indicators : indicators.filter((i) => i.projectId === indicatorFilter);
  const statusChartData = useMemo(() => [
    { key:"en_curs", label:"En curs", value:projects.filter((p) => p.status === "en_curs").length, fill:"#158477" },
    { key:"planificat", label:"Planificats", value:projects.filter((p) => p.status === "planificat").length, fill:"#4f78a1" },
    { key:"pendent", label:"Pendents", value:projects.filter((p) => p.status === "pendent").length, fill:"#d5a13f" },
    { key:"bloquejat", label:"Bloquejats", value:projects.filter((p) => p.status === "bloquejat").length, fill:"#d46755" },
    { key:"finalitzat", label:"Finalitzats", value:projects.filter((p) => p.status === "finalitzat").length, fill:"#31506b" },
  ], [projects]);

  async function saveProject(project: Project) {
    setProjects((current) => {
      const next = current.map((p) => p.id === project.id ? project : p);
      saveLocalState(next, indicators);
      return next;
    });
    setEditing(null);
    const response = await fetch("/api/state", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ type:"project", projectId:project.id, status:project.status, progress:project.progress, startDate:project.startDate, endDate:project.endDate, nextMilestone:project.nextMilestone }) });
    if (!response.ok) return toast.error("No s'han pogut desar els canvis");
    toast.success("Projecte actualitzat");
  }

  async function saveIndicator(indicator: Indicator) {
    setIndicators((current) => {
      const next = current.map((i) => i.id === indicator.id ? indicator : i);
      saveLocalState(projects, next);
      return next;
    });
    setEditing(null);
    const response = await fetch("/api/state", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ type:"indicator", indicatorId:indicator.id, actualValue:indicator.actualValue, notes:indicator.notes }) });
    if (!response.ok) return toast.error("No s'ha pogut desar l'indicador");
    toast.success("Indicador actualitzat");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">LD</div>
        <div className="brand-copy"><strong>La Descomunal</strong><span>Seguiment 2026–2028</span></div>
        <div className="topbar-meta"><span className="live-dot" />Dades de seguiment</div>
      </header>
      <div className="page-wrap">
        <section className="page-heading">
          <div><p className="eyebrow">Comunalitat Urbana Zona 09</p><h1>Quadre de seguiment</h1><p>Visió compartida dels nou projectes, el cronograma i els indicadors d’assoliment.</p></div>
          <div className="period-chip"><CalendarRange size={17}/> Febrer 2026 — Febrer 2028</div>
        </section>
        <Tabs defaultValue="dashboard" className="workspace-tabs">
          <TabsList className="main-tabs">
            <TabsTrigger value="dashboard"><LayoutDashboard/>Resum</TabsTrigger>
            <TabsTrigger value="projects"><FolderKanban/>Projectes</TabsTrigger>
            <TabsTrigger value="gantt"><CalendarRange/>Cronograma</TabsTrigger>
            <TabsTrigger value="indicators"><Target/>Indicadors</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="tab-panel">
            <div className="metric-grid">
              <Metric icon={<FolderKanban/>} label="Projectes actius" value={`${activeProjects} / 9`} note="Projectes actualment en curs" tone="navy" />
              <Metric icon={<CircleGauge/>} label="Avanç global" value={`${globalProgress}%`} note="Estimació actual del programa" tone="teal" />
              <Metric icon={<Target/>} label="Indicadors mesurats" value={`${measured.length} / ${indicators.length}`} note={`${achieved} compleixen el mínim`} tone="gold" />
              <Metric icon={blockedProjects ? <AlertTriangle/> : <CheckCircle2/>} label="Alertes" value={String(blockedProjects)} note={blockedProjects ? "Projectes bloquejats" : "Cap projecte bloquejat"} tone="coral" />
            </div>
            <div className="visual-summary-grid">
              <section className="panel global-visual-panel">
                <div className="panel-title"><div><h2>Pols del programa</h2><p>Lectura ràpida de l’avanç global</p></div><CircleGauge /></div>
                <div className="global-progress-visual">
                  <div className="progress-ring" style={{"--progress":`${globalProgress * 3.6}deg`} as React.CSSProperties}>
                    <div><strong>{globalProgress}%</strong><span>completat</span></div>
                  </div>
                  <div className="global-progress-copy">
                    <span className="visual-kicker">AVANÇ DEL PROGRAMA</span>
                    <strong>El programa ja està en marxa</strong>
                    <p>El 30% reflecteix el treball activat durant els primers mesos del període.</p>
                    <div className="progress-scale"><i style={{width:`${globalProgress}%`}} /></div>
                    <div className="scale-labels"><span>Feb. 2026</span><span>Feb. 2028</span></div>
                  </div>
                </div>
              </section>
              <section className="panel status-visual-panel">
                <div className="panel-title"><div><h2>Estat dels projectes</h2><p>Distribució actual dels nou projectes</p></div><BarChart3 /></div>
                <ChartContainer config={{projectes:{label:"Projectes",color:"#158477"}}} className="status-chart" initialDimension={{width:520,height:230}}>
                  <BarChart accessibilityLayer data={statusChartData} layout="vertical" margin={{top:8,right:28,bottom:8,left:8}}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0,9]} allowDecimals={false} hide />
                    <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={82} />
                    <ChartTooltip cursor={{fill:"rgba(13,97,91,.05)"}} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="value" name="projectes" radius={[0,8,8,0]} barSize={18}>
                      {statusChartData.map((entry)=><Cell key={entry.key} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </section>
            </div>
            <section className="panel team-panel">
              <div className="panel-title"><div><h2>Equip tècnic i Comitè Activador</h2><p>Set professionals de les cinc entitats responsables</p></div><span className="team-count">5 entitats</span></div>
              <div className="team-grid">
                {technicalTeam.map((member, index)=><article className="team-card" key={member.entity}>
                  <span className="team-initial">{member.entity.charAt(0)}</span>
                  <div><small>Entitat del Comitè Activador</small><strong>{member.entity}</strong><span>{member.names.join(" · ")}</span></div>
                  <b>{String(index + 1).padStart(2,"0")}</b>
                </article>)}
              </div>
            </section>
            <div className="dashboard-grid">
              <section className="panel progress-panel">
                <div className="panel-title"><div><h2>Avanç per projecte</h2><p>Clica un projecte per actualitzar-lo</p></div><BarChart3 /></div>
                <div className="project-progress-list">
                  {projects.map((project) => <button key={project.id} className="project-progress-row" onClick={() => setEditing({kind:"project", item:project})}>
                    <span className="project-number">{project.number}</span><span className="project-progress-name"><strong>{project.shortName}</strong><span>{project.owner}</span></span><Progress value={project.progress ?? 0} className="project-progress-bar" /><strong className="progress-value">{project.progress === null ? "—" : `${project.progress}%`}</strong><ChevronRight size={17}/>
                  </button>)}
                </div>
              </section>
              <section className="panel next-panel">
                <div className="panel-title"><div><h2>Pròxims passos</h2><p>Fites que cal tenir presents</p></div><Clock3/></div>
                <div className="milestone-list">{upcomingEvents.map((event) => { const project = projects.find((p) => p.id === event.projectId)!; return <button key={event.id} onClick={() => setEditing({kind:"project", item:project})}><span className="milestone-date">{event.dateLabel}</span><span><strong>{event.title}</strong><small>P{project.number} · {project.shortName}</small></span><ChevronRight size={16}/></button> })}</div>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="tab-panel">
            <div className="section-head"><div><h2>Els nou projectes</h2><p>Responsables, estat, progrés i pròxima fita.</p></div></div>
            <div className="project-card-grid">{projects.map((project) => <article key={project.id} className="project-card">
              <div className="project-card-top"><span className="large-number">{String(project.number).padStart(2,"0")}</span><ProjectPill status={project.status}/></div><h3>{project.shortName}</h3><p>{project.summary}</p>
              <div className="project-owner">Responsable <strong>{project.owner}</strong></div><div className="activity-count">{project.activities.length ? `${project.activities.length} activitats registrades` : "Sense activitats registrades"}</div><div className="project-card-progress"><div><span>Avanç</span><strong>{project.progress === null ? "Pendent de calcular" : `${project.progress}%`}</strong></div><Progress value={project.progress ?? 0}/></div>
              <button className="edit-link" onClick={() => setEditing({kind:"project", item:project})}><Pencil size={15}/> Actualitzar projecte</button>
            </article>)}</div>
          </TabsContent>
          <TabsContent value="gantt" className="tab-panel"><Gantt projects={projects} onEdit={(project) => setEditing({kind:"project", item:project})}/></TabsContent>
          <TabsContent value="indicators" className="tab-panel">
            <section className="panel indicators-panel">
              <div className="section-head indicator-head"><div><h2>Indicadors d’assoliment</h2><p>Comparació entre el resultat actual, el mínim i l’òptim.</p></div>
                <Select value={indicatorFilter} onValueChange={setIndicatorFilter}><SelectTrigger className="filter-select"><SelectValue placeholder="Tots els projectes"/></SelectTrigger><SelectContent><SelectItem value="all">Tots els projectes</SelectItem>{projects.map((p)=><SelectItem key={p.id} value={p.id}>{p.number}. {p.shortName}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="indicator-table-wrap"><table className="indicator-table"><thead><tr><th>Projecte i indicador</th><th>Actual</th><th>Mínim</th><th>Òptim</th><th>Estat</th><th /></tr></thead><tbody>
                {filteredIndicators.map((indicator) => { const project = projects.find((p) => p.id === indicator.projectId)!; const state = indicatorState(indicator); return <tr key={indicator.id}><td><span className="table-project">P{project.number} · {project.shortName}</span><strong>{indicator.label}</strong><small>{indicator.source}</small></td><td className="numeric current-value">{formatIndicator(indicator.actualValue, indicator.unit)}</td><td className="numeric">{formatIndicator(indicator.minimum, indicator.unit)}</td><td className="numeric">{formatIndicator(indicator.optimum, indicator.unit)}</td><td><span className={`indicator-state state-${state}`}>{state === "optim" ? "Òptim" : state === "minim" ? "Mínim assolit" : state === "risc" ? "En risc" : "Pendent"}</span></td><td><Button variant="ghost" size="icon" aria-label={`Editar ${indicator.label}`} onClick={()=>setEditing({kind:"indicator", item:indicator})}><Pencil/></Button></td></tr>})}
              </tbody></table></div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="site-footer">Creat i dissenyat per Magdalena Ayerra</footer>
      <EditSheet editing={editing} onClose={()=>setEditing(null)} onSaveProject={saveProject} onSaveIndicator={saveIndicator}/><Toaster richColors position="bottom-right" />{loading && <div className="loading-line" />}
    </main>
  );
}

function Metric({ icon, label, value, note, tone }: { icon:React.ReactNode; label:string; value:string; note:string; tone:string }) { return <article className={`metric-card metric-${tone}`}><div className="metric-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>; }

function Gantt({ projects, onEdit }: { projects:Project[]; onEdit:(project:Project)=>void }) {
  const months = useMemo(() => Array.from({length:25}, (_, index) => { const date = new Date(2026,1+index,1); return { key:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`, label:date.toLocaleDateString("ca-ES",{month:"short"}), year:date.getFullYear() }; }), []);
  const start = new Date(2026,1,1).getTime(); const total = new Date(2028,2,1).getTime() - start;
  return <section className="panel gantt-panel"><div className="section-head"><div><h2>Cronograma general</h2><p>Planificació inicial editable · febrer 2026 — febrer 2028</p></div><span className="legend"><i/>Durada prevista</span></div>
    <div className="gantt-scroll"><div className="gantt" style={{"--months":months.length} as React.CSSProperties}>
      <div className="gantt-label gantt-corner">Projecte</div>{months.map((m,i)=><div key={m.key} className={`gantt-month ${i===0 || months[i-1].year!==m.year ? "new-year":""}`}><strong>{i===0 || months[i-1].year!==m.year ? m.year : ""}</strong><span>{m.label}</span></div>)}
      {projects.map((project) => { const hasDates = Boolean(project.startDate && project.endDate); const left = hasDates ? Math.max(0,(new Date(project.startDate).getTime()-start)/total*100) : 0; const right = hasDates ? Math.min(100,(new Date(project.endDate).getTime()-start)/total*100) : 0; const milestones = upcomingEvents.filter((event)=>event.projectId === project.id && event.date); return <div className="gantt-row" key={project.id}><button className="gantt-label project-label" onClick={()=>onEdit(project)}><span>{project.number}</span><strong>{project.shortName}</strong></button><div className="gantt-track">{hasDates ? <button className="gantt-bar" style={{left:`${left}%`,width:`${Math.max(2,right-left)}%`}} onClick={()=>onEdit(project)}><i style={{width:`${project.progress ?? 0}%`}}/><span>{project.progress === null ? "Pendent" : `${project.progress}%`}</span></button> : <button className="gantt-empty" onClick={()=>onEdit(project)}>Sense dates planificades</button>}{milestones.map((event)=>{ const milestoneLeft = Math.max(0,Math.min(100,(new Date(event.date!).getTime()-start)/total*100)); return <button key={event.id} className="gantt-milestone" style={{left:`${milestoneLeft}%`}} title={event.title} aria-label={`${event.dateLabel}: ${event.title}`} onClick={()=>onEdit(project)}><i/><span>{event.dateLabel}</span></button> })}</div></div>})}
    </div></div></section>;
}

function EditSheet({ editing, onClose, onSaveProject, onSaveIndicator }: { editing:Editing; onClose:()=>void; onSaveProject:(p:Project)=>void; onSaveIndicator:(i:Indicator)=>void }) {
  const [projectDraft, setProjectDraft] = useState<Project | null>(null); const [indicatorDraft, setIndicatorDraft] = useState<Indicator | null>(null);
  useEffect(()=>{ setProjectDraft(editing?.kind === "project" ? {...editing.item} : null); setIndicatorDraft(editing?.kind === "indicator" ? {...editing.item} : null); },[editing]);
  return <Sheet open={!!editing} onOpenChange={(open)=>!open && onClose()}><SheetContent className="edit-sheet"><SheetHeader><SheetTitle>{editing?.kind === "project" ? "Actualitzar projecte" : "Actualitzar indicador"}</SheetTitle><SheetDescription>Els canvis quedaran reflectits al quadre general.</SheetDescription></SheetHeader>
    {projectDraft && <form className="edit-form" onSubmit={(e)=>{e.preventDefault();onSaveProject(projectDraft)}}><div className="edit-context"><span>Projecte {projectDraft.number}</span><strong>{projectDraft.name}</strong></div>
      <section className="activity-history"><div><h3>Activitats registrades</h3><span>{projectDraft.activities.length}</span></div>{projectDraft.activities.length ? <div className="activity-list">{projectDraft.activities.map((activity)=><article className="activity-item" key={activity.id}><div><time>{activity.date}</time><strong>{activity.label}</strong></div><span className={`activity-status activity-${activity.status}`}>{activityLabels[activity.status]}</span></article>)}</div> : <p>Encara no hi ha activitats registrades.</p>}</section>
      <label>Estat<Select value={projectDraft.status} onValueChange={(value)=>setProjectDraft({...projectDraft,status:value as ProjectStatus})}><SelectTrigger className="w-full"><SelectValue/></SelectTrigger><SelectContent>{statuses.map((s)=><SelectItem value={s} key={s}>{statusLabels[s]}</SelectItem>)}</SelectContent></Select></label>
      <label>Avanç global <span className="inline-value">{projectDraft.progress === null ? "Pendent de calcular" : `${projectDraft.progress}%`}</span><input type="range" min="0" max="100" value={projectDraft.progress ?? 0} onChange={(e)=>setProjectDraft({...projectDraft,progress:Number(e.target.value)})}/></label>
      <div className="date-grid"><label>Data d’inici<Input type="date" value={projectDraft.startDate} onChange={(e)=>setProjectDraft({...projectDraft,startDate:e.target.value})}/></label><label>Data de finalització<Input type="date" value={projectDraft.endDate} onChange={(e)=>setProjectDraft({...projectDraft,endDate:e.target.value})}/></label></div>
      <label>Pròxima fita<Input value={projectDraft.nextMilestone} onChange={(e)=>setProjectDraft({...projectDraft,nextMilestone:e.target.value})}/></label><Button type="submit" className="save-button">Desar canvis</Button></form>}
    {indicatorDraft && <form className="edit-form" onSubmit={(e)=>{e.preventDefault();onSaveIndicator(indicatorDraft)}}><div className="edit-context"><span>Indicador</span><strong>{indicatorDraft.label}</strong></div><div className="target-boxes"><div><span>Mínim</span><strong>{formatIndicator(indicatorDraft.minimum,indicatorDraft.unit)}</strong></div><div><span>Òptim</span><strong>{formatIndicator(indicatorDraft.optimum,indicatorDraft.unit)}</strong></div></div>
      <label>Resultat actual{indicatorDraft.unit === "estat" ? <Select value={indicatorDraft.actualValue === null ? "pending" : String(indicatorDraft.actualValue)} onValueChange={(value)=>setIndicatorDraft({...indicatorDraft,actualValue:value==="pending"?null:Number(value)})}><SelectTrigger className="w-full"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="pending">Pendent de mesurar</SelectItem><SelectItem value="0">No assolit</SelectItem><SelectItem value="1">Assolit</SelectItem></SelectContent></Select> : <Input type="number" min="0" step="0.1" value={indicatorDraft.actualValue ?? ""} onChange={(e)=>setIndicatorDraft({...indicatorDraft,actualValue:e.target.value===""?null:Number(e.target.value)})}/>}</label>
      <label>Observacions<Textarea rows={5} value={indicatorDraft.notes} onChange={(e)=>setIndicatorDraft({...indicatorDraft,notes:e.target.value})} placeholder="Afegeix context sobre el resultat o la font de verificació…"/></label><p className="verification-note"><strong>Font prevista:</strong> {indicatorDraft.source}</p><Button type="submit" className="save-button">Desar indicador</Button></form>}
  </SheetContent></Sheet>;
}
