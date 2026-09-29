import type { Indicator, Project, ProjectActivity, UpcomingEvent } from "@/lib/data";

// Traducció al castellà dels textos de lib/data.ts, per id. Quan s'afegeix
// o es modifica un text a lib/data.ts, cal actualitzar-lo també aquí.

type ProjectText = Partial<Pick<Project, "name" | "shortName" | "owner" | "nextMilestone" | "summary">>;

export const projectsEs: Record<string, ProjectText> = {
  p1: { name:"Espacio Nova Essència: Emprendimiento y empoderamiento femenino", owner:"Ayuntamiento de Lleida · Fundació Champagnat · RECOOP", nextMilestone:"Segunda fase de peluquería +16 · 14 sept. 2026", summary:"Formación, empoderamiento y activación económica de mujeres del territorio." },
  p2: { name:"Creix i Participa: Dinamización comunitaria y refuerzo de la red", owner:"Comité Activador · 5 entidades", nextMilestone:"9.ª Asamblea de La Descomunal · mié. 7 oct. · 18.30 h", summary:"Gobernanza comunitaria y consolidación de la red, con RECOOP, Ayuntamiento de Lleida, Fundació Champagnat, UE Gardeny y Associació La Nou." },
  p3: { name:"Locals Vius: Relevo generacional y emprendimiento", owner:"Ayuntamiento de Lleida", summary:"Diagnóstico de locales vacíos en el barrio y acompañamiento de personas interesadas en colaboración con Promoción Económica." },
  p4: { name:"Infraestructura cultural comunitaria", shortName:"Cultura comunitaria", nextMilestone:"Inicio de capoeira · miércoles 9 sept. 2026", summary:"Procesos culturales con jóvenes y brigada técnica comunitaria." },
  p5: { name:"Empoderamiento alimentario y cocina que nos acerca", shortName:"Cocina y alimentación", nextMilestone:"Posible inauguración · octubre 2026 (fecha pendiente)", summary:"Alimentación saludable, vínculos sociales e interculturalidad en el barrio." },
  p6: { name:"Huerto y gallinero comunitario", shortName:"Huerto y gallinero", nextMilestone:"Primera plantación comunitaria · 5 oct. 2026", summary:"Gestión comunitaria, soberanía alimentaria y participación vecinal." },
  p7: { name:"Brigadas comunitarias", shortName:"Brigadas", nextMilestone:"Definición de la continuidad del itinerario formativo", summary:"Capacitación, actuaciones reales en el barrio e inserción laboral." },
  p8: { name:"Deporte y salud — Unió Esportiva Gardeny", shortName:"Deporte y salud", summary:"Actividad física, salud comunitaria, deporte femenino y rutas saludables con personas mayores." },
  p9: { name:"Espai Jove Zona 09: Ocio educativo e itinerarios de capacitación", nextMilestone:"Inicio de las cápsulas · 6 octubre 2026", summary:"Formación en ocio educativo, prácticas educativas y oportunidades laborales." },
};

export const activitiesEs: Record<string, Partial<Pick<ProjectActivity, "date" | "label">>> = {
  p1a1: { date:"Febrero 2026", label:"Prácticas formativas" },
  p1a2: { date:"Mayo–junio 2026", label:"Programa de peluquería de 120 horas para mujeres de 45 a 60 años" },
  p1a3: { date:"14 septiembre 2026", label:"Segunda fase del curso de peluquería para personas mayores de 16 años" },
  p1a4: { date:"Finales de 2026", label:"Curso de manicura" },
  p1a5: { date:"Fecha pendiente", label:"Curso de maquillaje" },
  p2a1: { date:"Fiesta Mayor 2026", label:"Acompañamiento a la Asociación de Vecinos de la Mariola en la campaña de comunicación de este año" },
  p2a2: { date:"7 octubre 2026 · 18.30 h", label:"9.ª Asamblea de La Descomunal" },
  p3a1: { label:"Diagnóstico de locales vacíos en el barrio, con 3 locales detectados con potencial para reabrir" },
  p3a2: { label:"Acogida y acompañamiento de 3 personas interesadas, en colaboración con Promoción Económica" },
  p4a1: { label:"Acompañamiento al Festival Enre9 y a la Escoleta d’Arts" },
  p4a2: { date:"Desde el 9 septiembre 2026", label:"Actividad de capoeira todos los miércoles" },
  p5a1: { label:"Talleres con Les Cassolanes" },
  p5a2: { label:"Talleres con la Associació Nostàlgia Lleida" },
  p5a3: { date:"Octubre 2026 · fecha pendiente", label:"Posible inauguración de la cocina" },
  p6a1: { label:"Cuatro reuniones de trabajo del grupo motor" },
  p6a2: { label:"Sesión de acompañamiento con Lliures" },
  p6a3: { label:"Reunión del grupo motor del Huerto con personas hortelanas" },
  p6a4: { date:"5 octubre 2026", label:"Primera plantación comunitaria" },
  p7a1: { label:"Primera formación para jóvenes sobre eventos culturales y grandes eventos" },
  p8a1: { label:"Creación del equipo de fútbol femenino" },
  p8a2: { label:"Actividad en colaboración con la Asociación de Personas Jubiladas de la Mariola" },
  p8a3: { label:"Rutas saludables matinales con personas mayores" },
  p9a1: { date:"Pendiente", label:"Valoración del pilotaje de la convocatoria anterior" },
  p9a2: { date:"6–9 octubre 2026", label:"Cuatro días de cápsulas formativas de ocio educativo" },
  p9a3: { date:"10, 17, 24 y 31 octubre 2026", label:"Cuatro Sábados Descomunales" },
};

export const eventsEs: Record<string, Partial<Pick<UpcomingEvent, "dateLabel" | "title">>> = {
  e0: { dateLabel:"9 SEPT", title:"Inicio de capoeira · actividad todos los miércoles" },
  e1: { dateLabel:"14 SEPT", title:"Inicio de la segunda fase del curso de peluquería" },
  e2: { dateLabel:"22 SEPT", title:"Reunión del Comité Activador" },
  e10: { title:"Primera plantación comunitaria" },
  e3: { title:"Cápsulas formativas de Espai Jove Zona 09" },
  e4: { title:"9.ª Asamblea de La Descomunal · miércoles, 18.30 h" },
  e5: { title:"1.er Sábado Descomunal" },
  e6: { title:"2.º Sábado Descomunal" },
  e7: { title:"3.er Sábado Descomunal" },
  e8: { title:"4.º Sábado Descomunal" },
  e9: { dateLabel:"OCT · PENDIENTE", title:"Posible inauguración de la cocina" },
};

export const indicatorsEs: Record<string, Partial<Pick<Indicator, "label" | "source" | "notes">>> = {
  i1a: { label:"Mujeres con asistencia sostenida", source:"Hojas de asistencia y registros de actividad" },
  i1b: { label:"Mujeres con mejora competencial observada", source:"Fichas de seguimiento competencial" },
  i1c: { label:"Mujeres que inician actividad, generan ingresos o avanzan en un proyecto", source:"Fichas de acompañamiento y evidencias de actividad" },
  i2a: { label:"Asambleas anuales con participación plural", source:"Actas de asambleas y espacios de gobernanza" },
  i2b: { label:"Nuevas entidades incorporadas o activadas", source:"Registro de entidades participantes" },
  i2c: { label:"Punto de encuentro comunitario en funcionamiento regular", source:"Registro de atención, consultas y derivaciones" },
  i3a: { label:"Participantes con proyecto de negocio definido y viable", source:"Planes de empresa o fichas de proyecto" },
  i3b: { label:"Locales vacíos activados o en proceso de activación", source:"Registro de locales y contactos con la propiedad" },
  i3c: { label:"Personas que inician actividad económica o profesional", source:"Fichas de acompañamiento y evidencias de actividad" },
  i4a: { label:"Jóvenes con participación cultural sostenida", source:"Registros de participación y actividades" },
  i4b: { label:"Proyectos o procesos culturales comunitarios activos", source:"Programaciones, dosieres y memorias culturales" },
  i4c: { label:"Brigada técnica comunitaria operativa", source:"Actas de coordinación de la red cultural" },
  i5a: { label:"Participantes con asistencia continuada", source:"Registros de asistencia y seguimiento" },
  i5b: { label:"Actividades gastronómicas e interculturales abiertas", source:"Calendarios y memorias de actividad" },
  i5c: { label:"Participantes que manifiestan mejora de los vínculos sociales", source:"Encuestas de valoración" },
  i5d: { label:"Participantes que manifiestan mejora de hábitos alimentarios", source:"Encuestas de valoración" },
  i6a: { label:"Asociación creada o en proceso avanzado", source:"Actas del grupo motor y documentación de constitución" },
  i6b: { label:"Participantes activos en la gestión y el mantenimiento", source:"Registros de participación y mantenimiento" },
  i6c: { label:"Acciones comunitarias o jornadas abiertas", source:"Memorias y materiales de difusión" },
  i7a: { label:"Participantes que finalizan el itinerario formativo", source:"Hojas de asistencia y registros de participación" },
  i7b: { label:"Participantes que intervienen en actuaciones reales", source:"Fichas y memorias de intervenciones" },
  i7c: { label:"Participantes con inserción laboral o autoempleo", source:"Contratos, derivaciones o evidencias de autoempleo" },
  i8a: { label:"Participantes con participación regular en deporte y salud", source:"Registros de actividades y asistencia" },
  i8b: { label:"Alianzas activas con agentes del territorio", source:"Acuerdos y actas de coordinación" },
  i8c: { label:"Participantes que acceden a itinerarios formativos o de inserción", source:"Fichas de derivación y seguimiento" },
  i9a: { label:"Jóvenes que completan la formación prevista", source:"Registros de asistencia a la formación" },
  i9b: { label:"Jóvenes que realizan prácticas educativas", source:"Fichas de prácticas y seguimiento educativo" },
  i9c: { label:"Jóvenes que acceden a inserción o activación laboral en ocio educativo", source:"Contratos, derivaciones o certificados" },
};

export const entityNamesEs: Record<string, string> = { "Ajuntament de Lleida":"Ayuntamiento de Lleida" };
export const rolesEs: Record<string, string> = { coordinadora:"coordinadora" };
