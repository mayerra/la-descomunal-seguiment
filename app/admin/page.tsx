import type { Metadata } from "next";
import AdminEditor from "@/components/admin/admin-editor";
import LoginForm from "@/components/admin/login-form";
import { isAuthConfigured, isAuthenticated } from "@/lib/auth";
import { isStoreConfigured, loadState } from "@/lib/store";

export const metadata: Metadata = { title: "Administració · La Descomunal" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!await isAuthenticated()) return <LoginForm configured={isAuthConfigured()} />;
  return <AdminEditor initialState={await loadState()} storeConfigured={isStoreConfigured()} />;
}
