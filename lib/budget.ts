// =====================================================================
//  PRESUPUESTO DE LA DESCOMUNAL
//  Este es el único archivo que hay que tocar para actualizar las cifras
//  de la pestaña "Pressupost / Presupuesto".
//
//  Cómo escribir los importes:
//   - En euros, sin puntos ni símbolo: 45000  (no 45.000 ni 45.000 €)
//   - Con decimales, usa punto: 1250.50
//   - Si todavía no tienes el dato, deja null
//
//  En la web se muestra el total de cada entidad. El reparto entre
//  nóminas y actividades solo aparece sumado para todo el programa.
// =====================================================================

export type BudgetYearId = "any1" | "any2";

export type BudgetAmounts = {
  nomines: number | null;     // Personal contratado (nóminas y seguridad social)
  activitats: number | null;  // Actividades, materiales y otros gastos
  executat: number | null;    // Lo gastado hasta ahora ese año
};

export type EntityBudget = { entity: string } & Record<BudgetYearId, BudgetAmounts>;

// Presupuesto total del programa por año.
export const budgetYears: { id: BudgetYearId; label: string; labelEs: string; total: number }[] = [
  { id:"any1", label:"Any 1 · feb. 2026 – gen. 2027", labelEs:"Año 1 · feb. 2026 – ene. 2027", total:175000 },
  { id:"any2", label:"Any 2 · feb. 2027 – feb. 2028", labelEs:"Año 2 · feb. 2027 – feb. 2028", total:175000 },
];

// Reparto por entidad. El nombre de la entidad debe coincidir con el del
// equipo técnico (lib/data.ts).
export const entityBudgets: EntityBudget[] = [
  {
    entity:"RECOOP",
    any1:{ nomines:null, activitats:null, executat:null },
    any2:{ nomines:null, activitats:null, executat:null },
  },
  {
    entity:"Ajuntament de Lleida",
    any1:{ nomines:null, activitats:null, executat:null },
    any2:{ nomines:null, activitats:null, executat:null },
  },
  {
    entity:"Fundació Champagnat",
    any1:{ nomines:null, activitats:null, executat:null },
    any2:{ nomines:null, activitats:null, executat:null },
  },
  {
    entity:"UE Gardeny",
    any1:{ nomines:null, activitats:null, executat:null },
    any2:{ nomines:null, activitats:null, executat:null },
  },
  {
    entity:"Associació La Nou",
    any1:{ nomines:null, activitats:null, executat:null },
    any2:{ nomines:null, activitats:null, executat:null },
  },
];
