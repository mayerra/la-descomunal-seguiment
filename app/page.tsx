"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, CalendarRange, CheckCircle2, ChevronRight, CircleGauge, Clock3, FolderKanban, LayoutDashboard, Target } from "lucide-react";
import { projects, indicators, upcomingEvents, Project, Indicator, ProjectStatus, ActivityStatus, statusLabels } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

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
  const [selected, setSelected] = useState<Project | null>(null);
  const [indicatorFilter, setIndicatorFilter] = useState("all");

  const globalProgress = 30;
  const activeProjects = projects.filter((p) => p.status === "en_curs").length;
  const blockedProjects = projects.filter((p) => p.status === "bloquejat").length;
  const measured = indicators.filter((i) => i.actualValue !== null);
  const achieved = measured.filter((i) => ["minim", "optim"].includes(indicatorState(i))).length;
  const filteredIndicators = indicatorFilter === "all" ? indicators : indicators.filter((i) => i.projectId === indicatorFilter);
  const statusChartData = [
    { key:"en_curs", label:"En curs", value:projects.filter((p) => p.status === "en_curs").length, fill:"#158477" },
    { key:"planificat", label:"Planificats", value:projects.filter((p) => p.status === "planificat").length, fill:"#4f78a1" },
    { key:"pendent", label:"Pendents", value:projects.filter((p) => p.status === "pendent").length, fill:"#d5a13f" },
    { key:"bloquejat", label:"Bloquejats", value:projects.filter((p) => p.status === "bloquejat").length, fill:"#d46755" },
    { key:"finalitzat", label:"Finalitzats", value:projects.filter((p) => p.status === "finalitzat").length, fill:"#31506b" },
  ];

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
                <div className="panel-title"><div><h2>Avanç per projecte</h2><p>Clica un projecte per veure’n el detall</p></div><BarChart3 /></div>
                <div className="project-progress-list">
                  {projects.map((project) => <button key={project.id} className="project-progress-row" onClick={() => setSelected(project)}>
                    <span className="project-number">{project.number}</span><span className="project-progress-name"><strong>{project.shortName}</strong><span>{project.owner}</span></span><Progress value={project.progress ?? 0} className="project-progress-bar" /><strong className="progress-value">{project.progress === null ? "—" : `${project.progress}%`}</strong><ChevronRight size={17}/>
                  </button>)}
                </div>
              </section>
              <section className="panel next-panel">
                <div className="panel-title"><div><h2>Pròxims passos</h2><p>Fites que cal tenir presents</p></div><Clock3/></div>
                <div className="milestone-list">{upcomingEvents.map((event) => { const project = projects.find((p) => p.id === event.projectId)!; return <button key={event.id} onClick={() => setSelected(project)}><span className="milestone-date">{event.dateLabel}</span><span><strong>{event.title}</strong><small>P{project.number} · {project.shortName}</small></span><ChevronRight size={16}/></button> })}</div>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="tab-panel">
            <div className="section-head"><div><h2>Els nou projectes</h2><p>Responsables, estat, progrés i pròxima fita.</p></div></div>
            <div className="project-card-grid">{projects.map((project) => <article key={project.id} className="project-card">
              <div className="project-card-top"><span className="large-number">{String(project.number).padStart(2,"0")}</span><ProjectPill status={project.status}/></div><h3>{project.shortName}</h3><p>{project.summary}</p>
              <div className="project-owner">Responsable <strong>{project.owner}</strong></div><div className="activity-count">{project.activities.length ? `${project.activities.length} activitats registrades` : "Sense activitats registrades"}</div><div className="project-card-progress"><div><span>Avanç</span><strong>{project.progress === null ? "Pendent de calcular" : `${project.progress}%`}</strong></div><Progress value={project.progress ?? 0}/></div>
              <button className="edit-link" onClick={() => setSelected(project)}>Veure detall <ChevronRight size={15}/></button>
            </article>)}</div>
          </TabsContent>
          <TabsContent value="gantt" className="tab-panel"><Gantt projects={projects} onSelect={setSelected}/></TabsContent>
          <TabsContent value="indicators" className="tab-panel">
            <section className="panel indicators-panel">
              <div className="section-head indicator-head"><div><h2>Indicadors d’assoliment</h2><p>Comparació entre el resultat actual, el mínim i l’òptim.</p></div>
                <Select value={indicatorFilter} onValueChange={setIndicatorFilter}><SelectTrigger className="filter-select"><SelectValue placeholder="Tots els projectes"/></SelectTrigger><SelectContent><SelectItem value="all">Tots els projectes</SelectItem>{projects.map((p)=><SelectItem key={p.id} value={p.id}>{p.number}. {p.shortName}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="indicator-table-wrap"><table className="indicator-table"><thead><tr><th>Projecte i indicador</th><th>Actual</th><th>Mínim</th><th>Òptim</th><th>Estat</th></tr></thead><tbody>
                {filteredIndicators.map((indicator) => { const project = projects.find((p) => p.id === indicator.projectId)!; const state = indicatorState(indicator); return <tr key={indicator.id}><td><span className="table-project">P{project.number} · {project.shortName}</span><strong>{indicator.label}</strong><small>{indicator.source}</small>{indicator.notes && <small>{indicator.notes}</small>}</td><td className="numeric current-value">{formatIndicator(indicator.actualValue, indicator.unit)}</td><td className="numeric">{formatIndicator(indicator.minimum, indicator.unit)}</td><td className="numeric">{formatIndicator(indicator.optimum, indicator.unit)}</td><td><span className={`indicator-state state-${state}`}>{state === "optim" ? "Òptim" : state === "minim" ? "Mínim assolit" : state === "risc" ? "En risc" : "Pendent"}</span></td></tr>})}
              </tbody></table></div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="site-footer">Creat i dissenyat per Magdalena Ayerra</footer>
      <ProjectSheet project={selected} onClose={()=>setSelected(null)}/>
    </main>
  );
}

function Metric({ icon, label, value, note, tone }: { icon:React.ReactNode; label:string; value:string; note:string; tone:string }) { return <article className={`metric-card metric-${tone}`}><div className="metric-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>; }

function Gantt({ projects, onSelect }: { projects:Project[]; onSelect:(project:Project)=>void }) {
  const months = useMemo(() => Array.from({length:25}, (_, index) => { const date = new Date(2026,1+index,1); return { key:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`, label:date.toLocaleDateString("ca-ES",{month:"short"}), year:date.getFullYear() }; }), []);
  const start = new Date(2026,1,1).getTime(); const total = new Date(2028,2,1).getTime() - start;
  return <section className="panel gantt-panel"><div className="section-head"><div><h2>Cronograma general</h2><p>Planificació · febrer 2026 — febrer 2028</p></div><span className="legend"><i/>Durada prevista</span></div>
    <div className="gantt-scroll"><div className="gantt" style={{"--months":months.length} as React.CSSProperties}>
      <div className="gantt-label gantt-corner">Projecte</div>{months.map((m,i)=><div key={m.key} className={`gantt-month ${i===0 || months[i-1].year!==m.year ? "new-year":""}`}><strong>{i===0 || months[i-1].year!==m.year ? m.year : ""}</strong><span>{m.label}</span></div>)}
      {projects.map((project) => { const hasDates = Boolean(project.startDate && project.endDate); const left = hasDates ? Math.max(0,(new Date(project.startDate).getTime()-start)/total*100) : 0; const right = hasDates ? Math.min(100,(new Date(project.endDate).getTime()-start)/total*100) : 0; const milestones = upcomingEvents.filter((event)=>event.projectId === project.id && event.date); return <div className="gantt-row" key={project.id}><button className="gantt-label project-label" onClick={()=>onSelect(project)}><span>{project.number}</span><strong>{project.shortName}</strong></button><div className="gantt-track">{hasDates ? <button className="gantt-bar" style={{left:`${left}%`,width:`${Math.max(2,right-left)}%`}} onClick={()=>onSelect(project)}><i style={{width:`${project.progress ?? 0}%`}}/><span>{project.progress === null ? "Pendent" : `${project.progress}%`}</span></button> : <button className="gantt-empty" onClick={()=>onSelect(project)}>Sense dates planificades</button>}{milestones.map((event)=>{ const milestoneLeft = Math.max(0,Math.min(100,(new Date(event.date!).getTime()-start)/total*100)); return <button key={event.id} className="gantt-milestone" style={{left:`${milestoneLeft}%`}} title={event.title} aria-label={`${event.dateLabel}: ${event.title}`} onClick={()=>onSelect(project)}><i/><span>{event.dateLabel}</span></button> })}</div></div>})}
    </div></div></section>;
}

function formatDate(value: string) {
  if (!value) return "Pendent";
  return new Date(value).toLocaleDateString("ca-ES", { day:"numeric", month:"short", year:"numeric" });
}

function ProjectSheet({ project, onClose }: { project:Project | null; onClose:()=>void }) {
  return <Sheet open={!!project} onOpenChange={(open)=>!open && onClose()}><SheetContent className="edit-sheet"><SheetHeader><SheetTitle>Detall del projecte</SheetTitle><SheetDescription>Informació actualitzada per l’equip tècnic.</SheetDescription></SheetHeader>
    {project && <div className="edit-form"><div className="edit-context"><span>Projecte {project.number}</span><strong>{project.name}</strong></div>
      <div className="detail-grid"><div><span>Estat</span><ProjectPill status={project.status}/></div><div><span>Avanç</span><strong>{project.progress === null ? "Pendent de calcular" : `${project.progress}%`}</strong></div><div><span>Inici</span><strong>{formatDate(project.startDate)}</strong></div><div><span>Finalització</span><strong>{formatDate(project.endDate)}</strong></div></div>
      <Progress value={project.progress ?? 0}/>
      <div className="detail-block"><span>Responsable</span><strong>{project.owner}</strong></div>
      {project.nextMilestone && <div className="detail-block"><span>Pròxima fita</span><strong>{project.nextMilestone}</strong></div>}
      <p className="detail-summary">{project.summary}</p>
      <section className="activity-history"><div><h3>Activitats registrades</h3><span>{project.activities.length}</span></div>{project.activities.length ? <div className="activity-list">{project.activities.map((activity)=><article className="activity-item" key={activity.id}><div><time>{activity.date}</time><strong>{activity.label}</strong></div><span className={`activity-status activity-${activity.status}`}>{activityLabels[activity.status]}</span></article>)}</div> : <p>Encara no hi ha activitats registrades.</p>}</section>
    </div>}
  </SheetContent></Sheet>;
}
