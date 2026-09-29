"use client";

import { useEffect, useMemo, useState } from "react";
import type { EntityBudget } from "@/lib/budget";
import { buildContent, type AppState } from "@/lib/state";
import Link from "next/link";
import { AlertTriangle, BarChart3, CalendarRange, CheckCircle2, ChevronRight, CircleGauge, Clock3, Euro, Eye, EyeOff, FolderKanban, LayoutDashboard, Target } from "lucide-react";
import { type Indicator, type Project, type ProjectStatus, type UpcomingEvent } from "@/lib/data";
import { budgetYears, type BudgetAmounts } from "@/lib/budget";
import { dictionaries, entityName, type Dictionary, type Lang } from "@/lib/i18n";
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

function formatIndicator(value: number | null, unit: Indicator["unit"], t: Dictionary) {
  if (value === null) return "—";
  if (unit === "%") return `${value}%`;
  if (unit === "estat") return value >= 1 ? t.indicatorsTab.achieved : t.indicatorsTab.notAchieved;
  return String(value);
}

function formatDate(value: string, t: Dictionary) {
  if (!value) return t.sheet.pending;
  return new Date(value).toLocaleDateString(t.locale, { day:"numeric", month:"short", year:"numeric" });
}

function formatEuros(value: number | null, t: Dictionary) {
  if (value === null) return t.budgetTab.pending;
  return new Intl.NumberFormat(t.locale, { style:"currency", currency:"EUR", maximumFractionDigits:0 }).format(value);
}

function ProjectPill({ status, t }: { status: ProjectStatus; t: Dictionary }) {
  return <span className={`status-pill status-${status}`}><span />{t.statusLabels[status]}</span>;
}

export default function Dashboard({ lang, state }: { lang: Lang; state: AppState }) {
  const t = dictionaries[lang];
  const { projects, indicators, upcomingEvents, technicalTeam, budget } = useMemo(() => buildContent(state, lang), [state, lang]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [indicatorFilter, setIndicatorFilter] = useState("all");
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const globalProgress = 30;
  const activeProjects = projects.filter((p) => p.status === "en_curs").length;
  const blockedProjects = projects.filter((p) => p.status === "bloquejat").length;
  const measured = indicators.filter((i) => i.actualValue !== null);
  const achieved = measured.filter((i) => ["minim", "optim"].includes(indicatorState(i))).length;
  const filteredIndicators = indicatorFilter === "all" ? indicators : indicators.filter((i) => i.projectId === indicatorFilter);
  const statusChartData = ([
    ["en_curs", "#158477"], ["planificat", "#4f78a1"], ["pendent", "#d5a13f"], ["bloquejat", "#d46755"], ["finalitzat", "#31506b"],
  ] as const).map(([key, fill]) => ({ key, fill, label:t.statusChart.labels[key], value:projects.filter((p) => p.status === key).length }));

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">LD</div>
        <div className="brand-copy"><strong>La Descomunal</strong><span>{t.appSubtitle}</span></div>
        <div className="topbar-meta"><span className="live-dot" />{state.updatedAt ? t.updated(new Date(state.updatedAt).toLocaleDateString(t.locale, { day:"numeric", month:"long", year:"numeric" })) : t.liveData}</div>
        <nav className="lang-switch" aria-label="Idioma">
          {(Object.keys(dictionaries) as Lang[]).map((code) => <Link key={code} href={dictionaries[code].path} className={code === lang ? "active" : undefined} aria-current={code === lang ? "page" : undefined}>{code.toUpperCase()}</Link>)}
        </nav>
      </header>
      <div className="page-wrap">
        <section className="page-heading">
          <div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></div>
          <div className="period-chip"><CalendarRange size={17}/> {t.period}</div>
        </section>
        <Tabs defaultValue="dashboard" className="workspace-tabs">
          <TabsList className="main-tabs">
            <TabsTrigger value="dashboard"><LayoutDashboard/>{t.tabs.dashboard}</TabsTrigger>
            <TabsTrigger value="projects"><FolderKanban/>{t.tabs.projects}</TabsTrigger>
            <TabsTrigger value="gantt"><CalendarRange/>{t.tabs.gantt}</TabsTrigger>
            <TabsTrigger value="indicators"><Target/>{t.tabs.indicators}</TabsTrigger>
            <TabsTrigger value="budget"><Euro/>{t.tabs.budget}</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="tab-panel">
            <div className="metric-grid">
              <Metric icon={<FolderKanban/>} label={t.metrics.active} value={`${activeProjects} / 9`} note={t.metrics.activeNote} tone="navy" />
              <Metric icon={<CircleGauge/>} label={t.metrics.progress} value={`${globalProgress}%`} note={t.metrics.progressNote} tone="teal" />
              <Metric icon={<Target/>} label={t.metrics.measured} value={`${measured.length} / ${indicators.length}`} note={t.metrics.measuredNote(achieved)} tone="gold" />
              <Metric icon={blockedProjects ? <AlertTriangle/> : <CheckCircle2/>} label={t.metrics.alerts} value={String(blockedProjects)} note={blockedProjects ? t.metrics.blocked : t.metrics.noBlocked} tone="coral" />
            </div>
            <div className="visual-summary-grid">
              <section className="panel global-visual-panel">
                <div className="panel-title"><div><h2>{t.pulse.title}</h2><p>{t.pulse.subtitle}</p></div><CircleGauge /></div>
                <div className="global-progress-visual">
                  <div className="progress-ring" style={{"--progress":`${globalProgress * 3.6}deg`} as React.CSSProperties}>
                    <div><strong>{globalProgress}%</strong><span>{t.pulse.completed}</span></div>
                  </div>
                  <div className="global-progress-copy">
                    <span className="visual-kicker">{t.pulse.kicker}</span>
                    <strong>{t.pulse.headline}</strong>
                    <p>{t.pulse.text(globalProgress)}</p>
                    <div className="progress-scale"><i style={{width:`${globalProgress}%`}} /></div>
                    <div className="scale-labels"><span>{t.pulse.start}</span><span>{t.pulse.end}</span></div>
                  </div>
                </div>
              </section>
              <section className="panel status-visual-panel">
                <div className="panel-title"><div><h2>{t.statusChart.title}</h2><p>{t.statusChart.subtitle}</p></div><BarChart3 /></div>
                <ChartContainer config={{projectes:{label:t.statusChart.series,color:"#158477"}}} className="status-chart" initialDimension={{width:520,height:230}}>
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
              <div className="panel-title"><div><h2>{t.team.title}</h2><p>{t.team.subtitle(technicalTeam.reduce((total, team) => total + team.members.length, 0))}</p></div><span className="team-count">{t.team.count}</span></div>
              <div className="team-grid">
                {technicalTeam.map((team, index)=><article className="team-card" key={team.entity}>
                  <span className="team-initial">{index + 1}</span>
                  <div><small>{t.team.entityLabel}</small><strong>{team.entity}</strong><span>{team.members.map((member) => member.role ? `${member.name} (${member.role})` : member.name).join(" · ")}</span></div>
                </article>)}
              </div>
            </section>
            <div className="dashboard-grid">
              <section className="panel progress-panel">
                <div className="panel-title"><div><h2>{t.progressPanel.title}</h2><p>{t.progressPanel.subtitle}</p></div><BarChart3 /></div>
                <div className="project-progress-list">
                  {projects.map((project) => <button key={project.id} className="project-progress-row" onClick={() => setSelected(project)}>
                    <span className="project-number">{project.number}</span><span className="project-progress-name"><strong>{project.shortName}</strong><span>{project.owner}</span></span><Progress value={project.progress ?? 0} className="project-progress-bar" /><strong className="progress-value">{project.progress === null ? "—" : `${project.progress}%`}</strong><ChevronRight size={17}/>
                  </button>)}
                </div>
              </section>
              <section className="panel next-panel">
                <div className="panel-title"><div><h2>{t.nextPanel.title}</h2><p>{t.nextPanel.subtitle}</p></div><Clock3/></div>
                <div className="milestone-list">{upcomingEvents.map((event) => { const project = projects.find((p) => p.id === event.projectId)!; return <button key={event.id} onClick={() => setSelected(project)}><span className="milestone-date">{event.dateLabel}</span><span><strong>{event.title}</strong><small>P{project.number} · {project.shortName}</small></span><ChevronRight size={16}/></button> })}</div>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="tab-panel">
            <div className="section-head"><div><h2>{t.projectsTab.title}</h2><p>{t.projectsTab.subtitle}</p></div></div>
            <div className="project-card-grid">{projects.map((project) => <article key={project.id} className="project-card">
              <div className="project-card-top"><span className="large-number">{String(project.number).padStart(2,"0")}</span><ProjectPill status={project.status} t={t}/></div><h3>{project.shortName}</h3><p>{project.summary}</p>
              <div className="project-owner">{t.projectsTab.owner} <strong>{project.owner}</strong></div><div className="activity-count">{project.activities.length ? t.projectsTab.activities(project.activities.length) : t.projectsTab.noActivities}</div><div className="project-card-progress"><div><span>{t.projectsTab.progress}</span><strong>{project.progress === null ? t.projectsTab.pendingProgress : `${project.progress}%`}</strong></div><Progress value={project.progress ?? 0}/></div>
              <button className="edit-link" onClick={() => setSelected(project)}>{t.projectsTab.detail} <ChevronRight size={15}/></button>
            </article>)}</div>
          </TabsContent>
          <TabsContent value="gantt" className="tab-panel"><Gantt projects={projects} upcomingEvents={upcomingEvents} onSelect={setSelected} t={t}/></TabsContent>
          <TabsContent value="indicators" className="tab-panel">
            <section className="panel indicators-panel">
              <div className="section-head indicator-head"><div><h2>{t.indicatorsTab.title}</h2><p>{t.indicatorsTab.subtitle}</p></div>
                <Select value={indicatorFilter} onValueChange={setIndicatorFilter}><SelectTrigger className="filter-select"><SelectValue placeholder={t.indicatorsTab.all}/></SelectTrigger><SelectContent><SelectItem value="all">{t.indicatorsTab.all}</SelectItem>{projects.map((p)=><SelectItem key={p.id} value={p.id}>{p.number}. {p.shortName}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="indicator-table-wrap"><table className="indicator-table"><thead><tr><th>{t.indicatorsTab.column}</th><th>{t.indicatorsTab.actual}</th><th>{t.indicatorsTab.minimum}</th><th>{t.indicatorsTab.optimum}</th><th>{t.indicatorsTab.state}</th></tr></thead><tbody>
                {filteredIndicators.map((indicator) => { const project = projects.find((p) => p.id === indicator.projectId)!; const state = indicatorState(indicator); return <tr key={indicator.id}><td><span className="table-project">P{project.number} · {project.shortName}</span><strong>{indicator.label}</strong><small>{indicator.source}</small>{indicator.notes && <small>{indicator.notes}</small>}</td><td className="numeric current-value">{formatIndicator(indicator.actualValue, indicator.unit, t)}</td><td className="numeric">{formatIndicator(indicator.minimum, indicator.unit, t)}</td><td className="numeric">{formatIndicator(indicator.optimum, indicator.unit, t)}</td><td><span className={`indicator-state state-${state}`}>{t.indicatorsTab.states[state]}</span></td></tr>})}
              </tbody></table></div>
            </section>
          </TabsContent>
          <TabsContent value="budget" className="tab-panel"><Budget lang={lang} t={t} entityBudgets={budget}/></TabsContent>
        </Tabs>
      </div>
      <footer className="site-footer">{t.footer} · <Link href="/admin">{t.teamAccess}</Link></footer>
      <ProjectSheet project={selected} onClose={()=>setSelected(null)} t={t}/>
    </main>
  );
}

function Metric({ icon, label, value, note, tone }: { icon:React.ReactNode; label:string; value:string; note:string; tone:string }) { return <article className={`metric-card metric-${tone}`}><div className="metric-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>; }

// Suma els imports coneguts; null si encara no n'hi ha cap.
function sum(values: (number | null)[]) {
  const known = values.filter((value): value is number => value !== null);
  return known.length ? known.reduce((total, value) => total + value, 0) : null;
}

const allocated = (amounts: BudgetAmounts) => sum([amounts.nomines, amounts.activitats]);

const HIDE_AMOUNTS_KEY = "ld-hide-amounts";

function Budget({ lang, t, entityBudgets }: { lang:Lang; t:Dictionary; entityBudgets:EntityBudget[] }) {
  const b = t.budgetTab;
  // La pestanya només es munta al navegador (en fer-hi clic), així que es pot
  // llegir la preferència desada directament.
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem(HIDE_AMOUNTS_KEY) === "1"; } catch { return false; } });
  const toggleHidden = () => setHidden((current) => { try { localStorage.setItem(HIDE_AMOUNTS_KEY, current ? "0" : "1"); } catch {} return !current; });
  const eur = (value: number | null) => hidden && value !== null ? "••••• €" : formatEuros(value, t);
  const percent = (part: number | null, whole: number | null) => part !== null && whole ? Math.round(part / whole * 100) : null;
  const programTotal = budgetYears.reduce((total, year) => total + year.total, 0);
  const rows = entityBudgets.map((line) => {
    const years = budgetYears.map((year) => allocated(line[year.id]));
    const total = sum(years);
    const executed = sum(budgetYears.map((year) => line[year.id].executat));
    return { entity:entityName(line.entity, lang), years, total, executed, rate:percent(executed, total) };
  });
  const assigned = sum(rows.map((row) => row.total));
  const executed = sum(rows.map((row) => row.executed));
  const staff = sum(entityBudgets.flatMap((line) => budgetYears.map((year) => line[year.id].nomines)));
  const activities = sum(entityBudgets.flatMap((line) => budgetYears.map((year) => line[year.id].activitats)));
  const staffShare = percent(staff, sum([staff, activities]));
  return <>
    <div className="budget-toolbar"><button type="button" className="amounts-toggle" onClick={toggleHidden} aria-pressed={hidden}>{hidden ? <Eye size={16}/> : <EyeOff size={16}/>}{hidden ? b.showAmounts : b.hideAmounts}</button></div>
    <div className="metric-grid">
      <Metric icon={<Euro/>} label={b.total} value={eur(programTotal)} note={b.totalNote(eur(budgetYears[0].total))} tone="navy" />
      <Metric icon={<FolderKanban/>} label={b.assigned} value={eur(assigned)} note={b.assignedNote(eur(programTotal - (assigned ?? 0)))} tone="teal" />
      <Metric icon={<CheckCircle2/>} label={b.executed} value={eur(executed)} note={b.executedNote} tone="gold" />
      <Metric icon={<CircleGauge/>} label={b.execution} value={executed === null ? "—" : `${percent(executed, programTotal)}%`} note={b.executionNote} tone="coral" />
    </div>
    <div className="visual-summary-grid">
      {budgetYears.map((year) => {
        const yearAssigned = sum(entityBudgets.map((line) => allocated(line[year.id])));
        const yearExecuted = sum(entityBudgets.map((line) => line[year.id].executat));
        const over = yearAssigned !== null && yearAssigned > year.total ? yearAssigned - year.total : 0;
        return <section className="panel budget-year" key={year.id}>
          <div className="panel-title"><div><h2>{lang === "es" ? year.labelEs : year.label}</h2><p>{eur(year.total)}</p></div><CalendarRange/></div>
          <div className="budget-year-body">
            <div><span>{b.yearAssigned}</span><strong>{eur(yearAssigned)}</strong><Progress value={percent(yearAssigned, year.total) ?? 0}/></div>
            <div><span>{b.yearExecuted}</span><strong>{eur(yearExecuted)}</strong><Progress value={percent(yearExecuted, year.total) ?? 0}/></div>
            {over > 0 && <p className="budget-note">{b.overBudget(eur(over))}</p>}
          </div>
        </section>;
      })}
    </div>
    <section className="panel indicators-panel budget-panel">
      <div className="section-head"><div><h2>{b.conceptTitle}</h2><p>{b.conceptSubtitle}</p></div></div>
      {staffShare === null ? <p className="budget-note">{b.pendingNote}</p> : <>
        <div className="concept-bar"><i style={{width:`${staffShare}%`}}/></div>
        <div className="concept-legend"><span><i className="staff"/>{b.staff} · {eur(staff)} · {staffShare}%</span><span><i/>{b.activities} · {eur(activities)} · {100 - staffShare}%</span></div>
      </>}
    </section>
    <section className="panel indicators-panel budget-panel">
      <div className="section-head"><div><h2>{b.title}</h2><p>{b.subtitle}</p></div></div>
      {assigned === null && <p className="budget-note">{b.pendingNote}</p>}
      <div className="indicator-table-wrap"><table className="indicator-table budget-table"><thead><tr><th>{b.entity}</th>{budgetYears.map((year) => <th key={year.id}>{(lang === "es" ? year.labelEs : year.label).split(" · ")[0]}</th>)}<th>{b.totalColumn}</th><th>{b.executed}</th><th>{b.execution}</th></tr></thead><tbody>
        {rows.map((row) => <tr key={row.entity}><td><strong>{row.entity}</strong></td>{row.years.map((value, index) => <td className="numeric" key={budgetYears[index].id}>{eur(value)}</td>)}<td className="numeric">{eur(row.total)}</td><td className="numeric">{eur(row.executed)}</td><td><div className="budget-rate"><Progress value={row.rate ?? 0}/><strong>{row.rate === null ? "—" : `${row.rate}%`}</strong></div></td></tr>)}
      </tbody><tfoot><tr><td><strong>{b.totalRow}</strong></td>{budgetYears.map((year) => <td className="numeric" key={year.id}>{eur(sum(entityBudgets.map((line) => allocated(line[year.id]))))}</td>)}<td className="numeric">{eur(assigned)}</td><td className="numeric">{eur(executed)}</td><td><strong>{percent(executed, assigned) === null ? "—" : `${percent(executed, assigned)}%`}</strong></td></tr></tfoot></table></div>
    </section>
  </>;
}

function Gantt({ projects, upcomingEvents, onSelect, t }: { projects:Project[]; upcomingEvents:UpcomingEvent[]; onSelect:(project:Project)=>void; t:Dictionary }) {
  const months = useMemo(() => Array.from({length:25}, (_, index) => { const date = new Date(2026,1+index,1); return { key:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`, label:date.toLocaleDateString(t.locale,{month:"short"}), year:date.getFullYear() }; }), [t.locale]);
  const start = new Date(2026,1,1).getTime(); const total = new Date(2028,2,1).getTime() - start;
  return <section className="panel gantt-panel"><div className="section-head"><div><h2>{t.gantt.title}</h2><p>{t.gantt.subtitle}</p></div><span className="legend"><i/>{t.gantt.legend}</span></div>
    <div className="gantt-scroll"><div className="gantt" style={{"--months":months.length} as React.CSSProperties}>
      <div className="gantt-label gantt-corner">{t.gantt.project}</div>{months.map((m,i)=><div key={m.key} className={`gantt-month ${i===0 || months[i-1].year!==m.year ? "new-year":""}`}><strong>{i===0 || months[i-1].year!==m.year ? m.year : ""}</strong><span>{m.label}</span></div>)}
      {projects.map((project) => { const hasDates = Boolean(project.startDate && project.endDate); const left = hasDates ? Math.max(0,(new Date(project.startDate).getTime()-start)/total*100) : 0; const right = hasDates ? Math.min(100,(new Date(project.endDate).getTime()-start)/total*100) : 0; const milestones = upcomingEvents.filter((event)=>event.projectId === project.id && event.date); return <div className="gantt-row" key={project.id}><button className="gantt-label project-label" onClick={()=>onSelect(project)}><span>{project.number}</span><strong>{project.shortName}</strong></button><div className="gantt-track">{hasDates ? <button className="gantt-bar" style={{left:`${left}%`,width:`${Math.max(2,right-left)}%`}} onClick={()=>onSelect(project)}><i style={{width:`${project.progress ?? 0}%`}}/><span>{project.progress === null ? t.gantt.pending : `${project.progress}%`}</span></button> : <button className="gantt-empty" onClick={()=>onSelect(project)}>{t.gantt.noDates}</button>}{milestones.map((event)=>{ const milestoneLeft = Math.max(0,Math.min(100,(new Date(event.date!).getTime()-start)/total*100)); return <button key={event.id} className="gantt-milestone" style={{left:`${milestoneLeft}%`}} title={event.title} aria-label={`${event.dateLabel}: ${event.title}`} onClick={()=>onSelect(project)}><i/><span>{event.dateLabel}</span></button> })}</div></div>})}
    </div></div></section>;
}

function ProjectSheet({ project, onClose, t }: { project:Project | null; onClose:()=>void; t:Dictionary }) {
  return <Sheet open={!!project} onOpenChange={(open)=>!open && onClose()}><SheetContent className="edit-sheet"><SheetHeader><SheetTitle>{t.sheet.title}</SheetTitle><SheetDescription>{t.sheet.description}</SheetDescription></SheetHeader>
    {project && <div className="edit-form"><div className="edit-context"><span>{t.sheet.project} {project.number}</span><strong>{project.name}</strong></div>
      <div className="detail-grid"><div><span>{t.sheet.state}</span><ProjectPill status={project.status} t={t}/></div><div><span>{t.sheet.progress}</span><strong>{project.progress === null ? t.projectsTab.pendingProgress : `${project.progress}%`}</strong></div><div><span>{t.sheet.start}</span><strong>{formatDate(project.startDate, t)}</strong></div><div><span>{t.sheet.end}</span><strong>{formatDate(project.endDate, t)}</strong></div></div>
      <Progress value={project.progress ?? 0}/>
      <div className="detail-block"><span>{t.sheet.owner}</span><strong>{project.owner}</strong></div>
      {project.nextMilestone && <div className="detail-block"><span>{t.sheet.next}</span><strong>{project.nextMilestone}</strong></div>}
      <p className="detail-summary">{project.summary}</p>
      <section className="activity-history"><div><h3>{t.sheet.activities}</h3><span>{project.activities.length}</span></div>{project.activities.length ? <div className="activity-list">{project.activities.map((activity)=><article className="activity-item" key={activity.id}><div><time>{activity.date}</time><strong>{activity.label}</strong></div><span className={`activity-status activity-${activity.status}`}>{t.activityLabels[activity.status]}</span></article>)}</div> : <p>{t.sheet.noActivities}</p>}</section>
    </div>}
  </SheetContent></Sheet>;
}
