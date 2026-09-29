export type ProjectStatus = "pendent" | "planificat" | "en_curs" | "bloquejat" | "finalitzat";

export type ActivityStatus = "fet" | "en_curs" | "previst" | "pendent";
export type ProjectActivity = { id: string; date: string; label: string; status: ActivityStatus };
export type Project = { id: string; number: number; name: string; shortName: string; owner: string; status: ProjectStatus; progress: number | null; startDate: string; endDate: string; nextMilestone: string; summary: string; activities: ProjectActivity[] };
export type Indicator = { id: string; projectId: string; label: string; unit: "%" | "nombre" | "estat"; minimum: number; optimum: number; actualValue: number | null; source: string; notes: string };
export type UpcomingEvent = { id: string; projectId: string; dateLabel: string; title: string; date?: string };

export const projects: Project[] = [
  { id:"p1", number:1, name:"Espai Nova Essència: Emprenedoria i apoderament femení", shortName:"Nova Essència", owner:"Ajuntament de Lleida · Fundació Champagnat · RECOOP", status:"en_curs", progress:30, startDate:"2026-02-01", endDate:"2026-12-31", nextMilestone:"Segona fase de perruqueria +16 · 14 set. 2026", summary:"Formació, apoderament i activació econòmica de dones del territori.", activities:[
    { id:"p1a1", date:"Febrer 2026", label:"Pràctiques formatives", status:"fet" },
    { id:"p1a2", date:"Maig–juny 2026", label:"Programa de perruqueria de 120 hores per a dones de 45 a 60 anys", status:"fet" },
    { id:"p1a3", date:"14 setembre 2026", label:"Segona fase del curs de perruqueria per a persones de més de 16 anys", status:"previst" },
    { id:"p1a4", date:"Final de 2026", label:"Curs de manicura", status:"previst" },
    { id:"p1a5", date:"Data pendent", label:"Curs de maquillatge", status:"previst" },
  ] },
  { id:"p2", number:2, name:"Creix i Participa: Dinamització comunitària i reforç de la xarxa", shortName:"Creix i Participa", owner:"Comitè Activador · 5 entitats", status:"en_curs", progress:20, startDate:"2026-05-01", endDate:"2028-04-30", nextMilestone:"9a Assemblea de La Descomunal · dc. 7 oct. · 18.30 h", summary:"Governança comunitària i consolidació de la xarxa, amb RECOOP, Ajuntament de Lleida, Fundació Champagnat, UE Gardeny i Associació La Nou.", activities:[
    { id:"p2a1", date:"Festa Major 2026", label:"Acompanyament a l’Associació de Veïns de la Mariola dins la campanya de comunicació d’aquest any", status:"fet" },
    { id:"p2a2", date:"7 octubre 2026 · 18.30 h", label:"9a Assemblea de La Descomunal", status:"previst" },
  ] },
  { id:"p3", number:3, name:"Locals Vius: Relleu generacional i emprenedoria", shortName:"Locals Vius", owner:"Ajuntament de Lleida", status:"en_curs", progress:15, startDate:"", endDate:"", nextMilestone:"", summary:"Diagnosi de locals buits al barri i acompanyament de persones interessades en col·laboració amb Promoció Econòmica.", activities:[
    { id:"p3a1", date:"2026", label:"Diagnosi de locals buits al barri, amb 3 locals detectats amb potencial de ser reoberts", status:"en_curs" },
    { id:"p3a2", date:"2026", label:"Acollida i acompanyament de 3 persones interessades, en col·laboració amb Promoció Econòmica", status:"en_curs" },
  ] },
  { id:"p4", number:4, name:"Infraestructura cultural comunitària", shortName:"Cultura comunitària", owner:"La 9", status:"en_curs", progress:15, startDate:"2026-05-01", endDate:"2028-04-30", nextMilestone:"Inici de capoeira · dimecres 9 set. 2026", summary:"Processos culturals amb joves i brigada tècnica comunitària.", activities:[
    { id:"p4a1", date:"2026", label:"Acompanyament al Festival Enre9 i a l’Escoleta d’Arts", status:"en_curs" },
    { id:"p4a2", date:"Des del 9 setembre 2026", label:"Activitat de capoeira cada dimecres", status:"previst" },
  ] },
  { id:"p5", number:5, name:"Apoderament alimentari i cuina que ens apropa", shortName:"Cuina i alimentació", owner:"RECOOP", status:"en_curs", progress:25, startDate:"2026-05-01", endDate:"2028-04-30", nextMilestone:"Possible inauguració · octubre 2026 (data pendent)", summary:"Alimentació saludable, vincles socials i interculturalitat al barri.", activities:[
    { id:"p5a1", date:"2026", label:"Tallers amb Les Cassolanes", status:"fet" },
    { id:"p5a2", date:"2026", label:"Tallers amb l’Associació Nostàlgia Lleida", status:"fet" },
    { id:"p5a3", date:"Octubre 2026 · data pendent", label:"Possible inauguració de la cuina", status:"previst" },
  ] },
  { id:"p6", number:6, name:"Hort i Galliner comunitari", shortName:"Hort i galliner", owner:"RECOOP", status:"en_curs", progress:25, startDate:"2026-02-01", endDate:"2028-02-29", nextMilestone:"Primera plantada comunitària · 5 oct. 2026", summary:"Gestió comunitària, sobirania alimentària i participació veïnal.", activities:[
    { id:"p6a1", date:"2026", label:"Quatre reunions de treball del grup motor", status:"fet" },
    { id:"p6a2", date:"2026", label:"Sessió d’acompanyament amb Lliures", status:"fet" },
    { id:"p6a3", date:"2026", label:"Reunió del grup motor de l’Hort amb persones hortolanes", status:"fet" },
    { id:"p6a4", date:"5 octubre 2026", label:"Primera plantada comunitària", status:"previst" },
  ] },
  { id:"p7", number:7, name:"Brigades comunitàries", shortName:"Brigades", owner:"La 9 / UE Gardeny", status:"en_curs", progress:50, startDate:"2026-05-01", endDate:"2028-04-30", nextMilestone:"Definició de la continuïtat de l’itinerari formatiu", summary:"Capacitació, actuacions reals al barri i inserció laboral.", activities:[
    { id:"p7a1", date:"2026", label:"Primera formació per a joves sobre esdeveniments culturals i grans esdeveniments", status:"fet" },
  ] },
  { id:"p8", number:8, name:"Esport i salut — Unió Esportiva Gardeny", shortName:"Esport i salut", owner:"Unió Esportiva Gardeny", status:"en_curs", progress:20, startDate:"2026-05-01", endDate:"2028-04-30", nextMilestone:"", summary:"Activitat física, salut comunitària, esport femení i rutes saludables amb la gent gran.", activities:[
    { id:"p8a1", date:"2026", label:"Creació de l’equip de futbol femení", status:"en_curs" },
    { id:"p8a2", date:"2026", label:"Activitat en col·laboració amb l’Associació de Persones Jubilades de la Mariola", status:"en_curs" },
    { id:"p8a3", date:"2026", label:"Rutes saludables de matí amb la gent gran", status:"en_curs" },
  ] },
  { id:"p9", number:9, name:"Espai Jove Zona 09: Lleure educatiu i itineraris de capacitació", shortName:"Espai Jove Zona 09", owner:"Fundació Champagnat", status:"en_curs", progress:20, startDate:"2026-10-06", endDate:"2028-04-30", nextMilestone:"Inici de les càpsules · 6 octubre 2026", summary:"Formació en lleure, pràctiques educatives i oportunitats laborals.", activities:[
    { id:"p9a1", date:"Pendent", label:"Valoració del pilotatge de la convocatòria anterior", status:"pendent" },
    { id:"p9a2", date:"6–9 octubre 2026", label:"Quatre dies de càpsules formatives de lleure educatiu", status:"previst" },
    { id:"p9a3", date:"10, 17, 24 i 31 octubre 2026", label:"Quatre Dissabtes Descomunals", status:"previst" },
  ] },
];

export const upcomingEvents: UpcomingEvent[] = [
  { id:"e0", projectId:"p4", dateLabel:"9 SET", title:"Inici de capoeira · activitat cada dimecres" },
  { id:"e1", projectId:"p1", dateLabel:"14 SET", title:"Inici de la segona fase del curs de perruqueria" },
  { id:"e2", projectId:"p2", dateLabel:"22 SET", title:"Reunió del Comitè Activador" },
  { id:"e10", projectId:"p6", dateLabel:"5 OCT", title:"Primera plantada comunitària", date:"2026-10-05" },
  { id:"e3", projectId:"p9", dateLabel:"6–9 OCT", title:"Càpsules formatives d’Espai Jove Zona 09" },
  { id:"e4", projectId:"p2", dateLabel:"7 OCT", title:"9a Assemblea de La Descomunal · dimecres, 18.30 h" },
  { id:"e5", projectId:"p9", dateLabel:"10 OCT", title:"1r Dissabte Descomunal" },
  { id:"e6", projectId:"p9", dateLabel:"17 OCT", title:"2n Dissabte Descomunal" },
  { id:"e7", projectId:"p9", dateLabel:"24 OCT", title:"3r Dissabte Descomunal" },
  { id:"e8", projectId:"p9", dateLabel:"31 OCT", title:"4t Dissabte Descomunal" },
  { id:"e9", projectId:"p5", dateLabel:"OCT · PENDENT", title:"Possible inauguració de la cuina" },
];

export const indicators: Indicator[] = [
  { id:"i1a", projectId:"p1", label:"Dones amb assistència sostinguda", unit:"%", minimum:60, optimum:70, actualValue:null, source:"Fulls d’assistència i registres d’activitat", notes:"" },
  { id:"i1b", projectId:"p1", label:"Dones amb millora competencial observada", unit:"%", minimum:60, optimum:75, actualValue:null, source:"Fitxes de seguiment competencial", notes:"" },
  { id:"i1c", projectId:"p1", label:"Dones que inicien activitat, generen ingressos o avancen en un projecte", unit:"%", minimum:20, optimum:30, actualValue:null, source:"Fitxes d’acompanyament i evidències d’activitat", notes:"" },
  { id:"i2a", projectId:"p2", label:"Assemblees anuals amb participació plural", unit:"nombre", minimum:2, optimum:3, actualValue:null, source:"Actes d’assemblees i espais de governança", notes:"" },
  { id:"i2b", projectId:"p2", label:"Noves entitats incorporades o activades", unit:"nombre", minimum:2, optimum:3, actualValue:null, source:"Registre d’entitats participants", notes:"" },
  { id:"i2c", projectId:"p2", label:"Punt de trobada comunitari en funcionament regular", unit:"estat", minimum:1, optimum:1, actualValue:null, source:"Registre d’atenció, consultes i derivacions", notes:"" },
  { id:"i3a", projectId:"p3", label:"Participants amb projecte de negoci definit i viable", unit:"%", minimum:50, optimum:60, actualValue:null, source:"Plans d’empresa o fitxes de projecte", notes:"" },
  { id:"i3b", projectId:"p3", label:"Locals buits activats o en procés d’activació", unit:"nombre", minimum:1, optimum:3, actualValue:null, source:"Registre de locals i contactes amb propietat", notes:"" },
  { id:"i3c", projectId:"p3", label:"Persones que inicien activitat econòmica o professional", unit:"nombre", minimum:2, optimum:4, actualValue:null, source:"Fitxes d’acompanyament i evidències d’activitat", notes:"" },
  { id:"i4a", projectId:"p4", label:"Joves amb participació cultural sostinguda", unit:"%", minimum:60, optimum:70, actualValue:null, source:"Registres de participació i activitats", notes:"" },
  { id:"i4b", projectId:"p4", label:"Projectes o processos culturals comunitaris actius", unit:"nombre", minimum:2, optimum:4, actualValue:null, source:"Programacions, dossiers i memòries culturals", notes:"" },
  { id:"i4c", projectId:"p4", label:"Brigada tècnica comunitària operativa", unit:"estat", minimum:1, optimum:1, actualValue:null, source:"Actes de coordinació de la xarxa cultural", notes:"" },
  { id:"i5a", projectId:"p5", label:"Participants amb assistència continuada", unit:"%", minimum:60, optimum:70, actualValue:null, source:"Registres d’assistència i seguiment", notes:"" },
  { id:"i5b", projectId:"p5", label:"Activitats gastronòmiques i interculturals obertes", unit:"nombre", minimum:3, optimum:5, actualValue:null, source:"Calendaris i memòries d’activitat", notes:"" },
  { id:"i5c", projectId:"p5", label:"Participants que manifesten millora dels vincles socials", unit:"%", minimum:40, optimum:50, actualValue:null, source:"Enquestes de valoració", notes:"" },
  { id:"i5d", projectId:"p5", label:"Participants que manifesten millora d’hàbits alimentaris", unit:"%", minimum:40, optimum:50, actualValue:null, source:"Enquestes de valoració", notes:"" },
  { id:"i6a", projectId:"p6", label:"Associació creada o en procés avançat", unit:"estat", minimum:1, optimum:1, actualValue:null, source:"Actes del grup motor i documentació de constitució", notes:"" },
  { id:"i6b", projectId:"p6", label:"Participants actius en la gestió i manteniment", unit:"%", minimum:60, optimum:75, actualValue:null, source:"Registres de participació i manteniment", notes:"" },
  { id:"i6c", projectId:"p6", label:"Accions comunitàries o jornades obertes", unit:"nombre", minimum:2, optimum:4, actualValue:null, source:"Memòries i materials de difusió", notes:"" },
  { id:"i7a", projectId:"p7", label:"Participants que finalitzen l’itinerari formatiu", unit:"%", minimum:70, optimum:80, actualValue:null, source:"Fulls d’assistència i registres de participació", notes:"" },
  { id:"i7b", projectId:"p7", label:"Participants que intervenen en actuacions reals", unit:"%", minimum:60, optimum:75, actualValue:null, source:"Fitxes i memòries d’intervencions", notes:"" },
  { id:"i7c", projectId:"p7", label:"Participants amb inserció laboral o autoocupació", unit:"%", minimum:20, optimum:25, actualValue:null, source:"Contractes, derivacions o evidències d’autoocupació", notes:"" },
  { id:"i8a", projectId:"p8", label:"Participants amb participació regular en esport i salut", unit:"%", minimum:60, optimum:70, actualValue:null, source:"Registres d’activitats i assistència", notes:"" },
  { id:"i8b", projectId:"p8", label:"Aliances actives amb agents del territori", unit:"nombre", minimum:3, optimum:5, actualValue:null, source:"Acords i actes de coordinació", notes:"" },
  { id:"i8c", projectId:"p8", label:"Participants que accedeixen a itineraris formatius o d’inserció", unit:"%", minimum:15, optimum:20, actualValue:null, source:"Fitxes de derivació i seguiment", notes:"" },
  { id:"i9a", projectId:"p9", label:"Joves que completen la formació prevista", unit:"%", minimum:65, optimum:75, actualValue:null, source:"Registres d’assistència a la formació", notes:"" },
  { id:"i9b", projectId:"p9", label:"Joves que realitzen pràctiques educatives", unit:"%", minimum:60, optimum:70, actualValue:null, source:"Fitxes de pràctiques i seguiment educatiu", notes:"" },
  { id:"i9c", projectId:"p9", label:"Joves que accedeixen a inserció o activació laboral en lleure", unit:"%", minimum:15, optimum:20, actualValue:null, source:"Contractes, derivacions o certificats", notes:"" },
];

export const statusLabels: Record<ProjectStatus, string> = { pendent:"Pendent", planificat:"Planificat", en_curs:"En curs", bloquejat:"Bloquejat", finalitzat:"Finalitzat" };
