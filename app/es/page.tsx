import type { Metadata } from "next";
import Dashboard from "@/components/dashboard";
import { loadState } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seguimiento La Descomunal",
  description: "Cuadro de seguimiento de los nueve proyectos de La Descomunal 2026-2028.",
};

export default async function HomeEs() {
  return <Dashboard lang="es" state={await loadState()} />;
}
