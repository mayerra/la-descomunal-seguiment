import type { Metadata } from "next";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Seguimiento La Descomunal",
  description: "Cuadro de seguimiento de los nueve proyectos de La Descomunal 2026-2028.",
};

export default function HomeEs() {
  return <Dashboard lang="es" />;
}
