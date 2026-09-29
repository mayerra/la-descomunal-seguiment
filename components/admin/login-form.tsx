"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ password }) });
    if (response.ok) return router.refresh();
    setError((await response.json().catch(() => null))?.error ?? "No s'ha pogut entrar");
    setLoading(false);
  }

  return <main className="app-shell admin-login">
    <form className="panel login-card" onSubmit={submit}>
      <span className="login-icon"><LockKeyhole size={20}/></span>
      <h1>Accés de l’equip</h1>
      <p>Introdueix la contrasenya per actualitzar el quadre de seguiment.</p>
      {configured ? <>
        <input className="field" type="password" autoComplete="current-password" placeholder="Contrasenya" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading}>{loading ? "Entrant…" : "Entrar"}</button>
      </> : <p className="form-error">Encara no s’ha configurat la contrasenya. Cal crear la variable ADMIN_PASSWORD a Vercel.</p>}
      <Link className="login-back" href="/">← Tornar al quadre</Link>
    </form>
  </main>;
}
