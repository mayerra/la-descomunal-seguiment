import Dashboard from "@/components/dashboard";
import { loadState } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <Dashboard lang="ca" state={await loadState()} />;
}
