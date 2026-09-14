# La Descomunal · Seguiment 2026–2028

Quadre de seguiment dels nou projectes de La Descomunal. Aquesta versió està preparada per publicar-se a **Vercel** des d'aquest mateix repositori de GitHub.

## Publicació a Vercel

1. A Vercel, selecciona **Add New → Project**.
2. Importa el repositori `la-descomunal-seguiment`.
3. Vercel detectarà automàticament **Next.js**.
4. Mantén la configuració predeterminada i prem **Deploy**.

No cal configurar Cloudflare, Workers, Wrangler ni cap base de dades D1.

## Desenvolupament local

```bash
npm ci
npm run dev
```

## Comprovació de producció

```bash
npm run build
npm run start
```

## Notes sobre les dades

El quadre es publica amb les dades inicials incloses al projecte. Els canvis fets des del navegador es desen localment en aquell navegador i dispositiu.
