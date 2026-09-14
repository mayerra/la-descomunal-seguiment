// The Vercel build does not use the Cloudflare D1 adapter.
// State is served by the Vercel-compatible API route.
export function getDb(): never {
  throw new Error("La versió Vercel no utilitza l'adaptador D1 de Cloudflare.");
}
