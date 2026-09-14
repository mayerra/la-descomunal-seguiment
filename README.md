# La Descomunal · Seguiment 2026–2028

Dashboard de seguiment dels nou projectes de La Descomunal. El projecte és una aplicació Vinext preparada per desplegar-se a Cloudflare Workers des d'un repositori de GitHub.

## Configuració inicial a Cloudflare

1. Crea una base de dades D1 amb el nom `la-descomunal-seguiment`.
2. Copia l'identificador de la base de dades a `wrangler.jsonc`, substituint el valor provisional de `database_id`.
3. Aplica la migració amb `npm run db:migrate:remote`.
4. Connecta aquest repositori a Cloudflare Workers Builds o desplega'l amb `npm run deploy`.

El binding de D1 ha de conservar el nom `DB`, perquè és el que utilitza l'aplicació.

## Desenvolupament

```bash
npm ci
npm run db:migrate:local
npm run dev
```

## Desplegament

```bash
npm run build
npm run deploy
```

Cloudflare proporcionarà una adreça `workers.dev`. El lloc original pot continuar actiu fins que el nou desplegament estigui verificat.
